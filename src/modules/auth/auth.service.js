import { createOne, findOne } from "../../DB/database.repository.js";
import {
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
import jwt from "jsonwebtoken";
import {
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
} from "../../../config/config.service.js";

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
    filter: { email },
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
