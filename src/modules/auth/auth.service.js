import { createOne, findOne } from "../../DB/database.repository.js";
import {
  BadReqeustException,
  compareHash,
  ConflictExecption,
  createLoginCredentials,
  generateHash,
  generateOTP,
  generateToken,
  getTokenSignature,
  NotFoundExecption,
  sendEmail,
} from "../../common/utils/index.js";
import { UserModel } from "../../DB/index.js";
import {
  HashApproachEnum,
  TokenTypeEnum,
} from "../../common/enums/security.enum.js";
import {OAuth2Client} from 'google-auth-library';
import { ProviderEnum } from "../../common/enums/user.enum.js";

export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const otp = generateOTP();

  const checkUserExist = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (checkUserExist) throw ConflictExecption({ message: "email Exist." });

  const user = await createOne({
    model: UserModel,
    data: {
      username,
      email,
      password: await generateHash({
        plaintext: password,
        approach: HashApproachEnum.bcrypt,
      }),
      phone,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    },
  });
  try {
    await sendEmail(email, otp);
  } catch (error) {
    console.log("Email error:", error);
  }
  return user;
};

export const verifyOTP = async ({ email, otp }) => {
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) throw NotFoundExecption({ message: "User not found" });

  if (user.otp != otp) throw ConflictExecption({ message: "Invalid OTP" });

  if (user.otpExpires < Date.now())
    throw ConflictExecption({ message: "OTP expired" });

  await UserModel.updateOne(
    { email },
    {
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
  );

  return { message: "Account verified" };
};

export const login = async (inputs, issuer) => {
  const { email, password } = inputs;

  const user = await findOne({
    model: UserModel,
    filter: { email , provider:ProviderEnum.System },
    options: { lean: true },
  });

  if (!user)
    throw NotFoundExecption({ message: "Invalid Login credentials.." });

  if (!user.isVerified)
    throw ConflictExecption({
      message: "Please verify your email first",
    });

  if (!(await compareHash({ plaintext: password, cipherText: user.password })))
    throw NotFoundExecption({ message: "Invalid Login credentials." });

  

  return await createLoginCredentials(user , issuer)
};



const verifyGoogleAccount = async (idToken) =>{
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: "1090676591358-6qlsqbav4jo67uqc3kvoo360nc1enar7.apps.googleusercontent.com",  
  });
  const payload = ticket.getPayload();

  if(!payload?.email_verified){
    throw BadReqeustException({message:"Fail to verify by google"})
    
  }


  return payload;
  
  
}



export const signupWithGmail = async(idToken , issuer)=>{

  const payload = await verifyGoogleAccount(idToken);
  console.log(payload);
   

  const checkExist = await findOne({
    model: UserModel,
    filter:{email:payload.email}
  })

  if(checkExist){
    if(checkExist.provider != ProviderEnum.Google){
      throw ConflictExecption({message:"Invalid Login Provider"})

    }
    return {status:200 , credentials:await loginWithGmail(idToken,issuer)};

  }

  const user = await createOne({
    model:UserModel,
    data:{
      firstName:payload.given_name,
      lastName:payload.family_name,
      email:payload.email,
      profilePicture:payload.picture,
      confirmEmail:new Date(),
      provider: ProviderEnum.Google

    }
  })

  return {status : 201 , credentials: await createLoginCredentials(user,issuer)}

}


export const loginWithGmail = async(idToken , issuer)=>{

  const payload = await verifyGoogleAccount(idToken);
  console.log(payload);
   

  const user = await findOne({
    model: UserModel,
    filter:{email:payload.email , provider:ProviderEnum.Google}
  })

  if(!user){
    throw NotFoundExecption({message:"NOt Registered Account"})

  }

  return await createLoginCredentials(user,issuer)

  

}