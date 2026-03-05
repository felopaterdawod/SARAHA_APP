import { Router } from "express";
<<<<<<< HEAD
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

=======
import { profile } from "./user.service.js";
const router=Router()

router.get("/" , (req,res,next)=>{
    const result  = profile(req.query.id)
    return res.status(200).json({message:"Profile" , result})
})
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
export default router