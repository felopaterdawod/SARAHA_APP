import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { successResponse } from "../../common/utils/index.js"
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enums/security.enum.js";
import { endpoint } from "./user.authorization.js";
import { RoleEnum } from "../../common/enums/user.enum.js";
const router=Router()

router.get("/" ,authentication(TokenTypeEnum.access),authorization(endpoint.profile),async(req,res,next)=>{
    const account  = await profile(req.user)
    return successResponse({res,data:{account}})
})


router.get("/rotate" ,authentication(TokenTypeEnum.refresh) ,async(req,res,next)=>{
    const account  = await rotateToken(req.user, `${req.protocol}://${req.host}`)
    return successResponse({res,data:{account}})
})

export default router