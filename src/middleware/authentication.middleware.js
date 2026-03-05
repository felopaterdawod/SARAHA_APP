import { TokenTypeEnum } from "../common/enums/security.enum.js"
import { BadReqeustException, decodeToken, ForbiddenException } from "../common/utils/index.js"


export const authentication = (tokenType=TokenTypeEnum.access)=>{
    return async (req ,res, next)=>{
        if(!req?.headers?.authorization)
            throw BadReqeustException({message:"Missing Authorization Key"})
        const {authorization} = req.headers
        console.log(authorization);

        const [flag , credential] = authorization.split(" ")
        if(!flag || !credential)
            throw BadReqeustException({message: "Misssing Authorization parts"})

        console.log({flag,credential});

        switch (flag) {
            case "Basic":
                const data = Buffer.from(Credential, 'base64').toString();
                const [username,password] = data.split(":")
                break;

            case 'Bearer':
                req.user = await decodeToken({token: credential , tokenType})    
        
            default:
                break;
        }
        next()
        
        
    }
}


export const authorization = (accessRoles = [], tokenType=TokenTypeEnum.access)=>{
    return async (req ,res, next)=>{
        if(!req?.headers?.authorization)
            throw BadReqeustException({message:"Missing Authorization Key"})
        console.log(req.user.role);
        if(!accessRoles.includes)
            throw ForbiddenException({message:"Not allowed account"})
        
        next()
    }
}