import jwt from "jsonwebtoken";
import {
    ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
  SYSTEM_ACCESS_TOKEN_SECRET_KEY,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  USER_ACCESS_TOKEN_SECRET_KEY,
  USER_REFRESH_TOKEN_SECRET_KEY,
} from "../../../../config/config.service.js";
import { RoleEnum } from "../../enums/user.enum.js";
import { AudienceEnum, TokenTypeEnum } from "../../enums/security.enum.js";
import { BadReqeustException, UnauthorizedException } from "../response/error.response.js";
import { findOne } from "../../../DB/database.repository.js";
import { UserModel } from "../../../DB/index.js";

export const generateToken = async ({
  payload = {},
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
  options = {},
} = {}) => {
  return jwt.sign(payload, secret, options);
};


export const verifyToken = async ({
  token,
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
  
} = {}) => {
  return jwt.verify(token, secret);
};

export const getTokenSignature = async (role) => {
  let accessSignature = undefined;
  let refreshSignature = undefined;
  let audience = AudienceEnum.User;

  switch (role) {
    case RoleEnum.admin:
      accessSignature = SYSTEM_ACCESS_TOKEN_SECRET_KEY;
      refreshSignature = SYSTEM_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.System;

      break;

    default:
      accessSignature = USER_ACCESS_TOKEN_SECRET_KEY;
      refreshSignature = USER_REFRESH_TOKEN_SECRET_KEY;
      audience = AudienceEnum.User;
      break;
  }

  return { accessSignature, refreshSignature, audience };
};

export const createLoginCredentials = async (user , issuer) => {
  const { accessSignature, refreshSignature, audience } =
    await getTokenSignature(user.role);

  const access_token = await generateToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      issuer: "",
      audience: [TokenTypeEnum.access, audience],
      expiresIn: ACCESS_EXPIRES_IN,
    },
  });

  const refresh_token = await generateToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      issuer: "",
      audience: [TokenTypeEnum.refresh, audience],
      expiresIn: REFRESH_EXPIRES_IN,
    },
  });

  return { access_token, refresh_token };
};


export const getSignatureLevel = async (audienceType)=>{
  let signatureLevel;
  switch (audienceType) {
    case AudienceEnum.System:
      signatureLevel = RoleEnum.admin
      break;
  
    default:
      signatureLevel = RoleEnum.user
      break;
  }
  return signatureLevel
} 


export const decodeToken = async({token , tokenType = TokenTypeEnum.access}={})=>{

  const decode = jwt.decode(token);

  if(!decode?.aud?.length)
    throw  BadReqeustException({message:"Fail to decoded this token aud is requried"})

  const [decodeTokenType , audienceType] = decode.aud;
  if(decodeTokenType !== tokenType){
    throw BadReqeustException({
      message: 
      `Invaild token type token of type ${decodeTokenType} 
      cannot access this api while we expected token of type ${tokenType}`
    })
  }

  const signatureLevel = await getSignatureLevel(audienceType)

  console.log({signatureLevel});

  const {accessSignature , refreshSignature} = await getTokenSignature(signatureLevel);
  console.log({accessSignature , refreshSignature});

  const verifiedData = await verifyToken({
    token,
    secret: tokenType == TokenTypeEnum.refresh ? refreshSignature : accessSignature

  })

  const user = await findOne({model:UserModel , filter:{_id:verifiedData.sub}})

  if(!user)
    throw UnauthorizedException({messsage :"account Not register" })

  return user
  
  
  







}



