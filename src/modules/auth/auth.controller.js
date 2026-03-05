import { Router } from 'express'
import {  login, signup, verifyOTP } from './auth.service.js';
import { successResponse } from '../../common/utils/index.js';
const router = Router(); 

router.post("/signup", async (req, res, next) => {
    const account = await signup(req.body)
    return successResponse({res,status:201,data:{account}})
})

<<<<<<< HEAD
router.post("/verifyOTP", async (req, res, next) => {
    const account = await verifyOTP(req.body)
    return successResponse({res,status:201,data:{account}})
})


=======
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
router.post("/login", async (req, res, next) => {
    const account = await login(req.body)
    return successResponse({res,status:201,data:{account}})
})


<<<<<<< HEAD

=======
router.post("/verifyOTP", async (req, res, next) => {
    const account = await verifyOTP(req.body)
    return successResponse({res,status:201,data:{account}})
})
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0



export default router