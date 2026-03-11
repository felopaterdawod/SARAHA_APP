import { compare, genSalt, hash } from "bcrypt";
import { SALT_ROUND } from "../../../../config/config.service.js";
import * as argon2 from 'argon2'
import { HashApproachEnum } from "../../enums/security.enum.js";

export const generateHash = async ({plaintext,salt=SALT_ROUND,minor='b',approach=HashApproachEnum.bcrypt}={})=>{
    let hashvalue;
    switch (approach) {
        case HashApproachEnum.argon2:
            hashvalue = await argon2.hash(plaintext)
            break;
    
        default:
            const generatedSalt  = await genSalt(salt,minor)
            hashvalue = await hash(plaintext,generatedSalt) 
            break;
    }

    return hashvalue
}


export const compareHash = async ({plaintext,cipherText ,approach=HashApproachEnum.bcrypt}={})=>{
    let match = false;
    switch (approach) {
        case HashApproachEnum.argon2:
            match = await argon2.verify(plaintext,cipherText)
            break;
    
        default:
            match = await compare(plaintext,cipherText)
            break;
    }

    return match
}