<<<<<<< HEAD
export const successResponse = ({res, message = "Done", status = 200,data=undefined}={})=>{
=======
export const successResponse =async ({res, message = "Done", status = 200,data=undefined})=>{
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
    return res.status(status).json({status,message,data})
}