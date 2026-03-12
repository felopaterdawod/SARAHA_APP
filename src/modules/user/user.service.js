import { createLoginCredentials, NotFoundExecption } from "../../common/utils/index.js"
import { findOne } from "../../DB/database.repository.js"
import { UserModel } from "../../DB/index.js"

export const profile   = async (user)=>{
    return user
}

export const rotateToken = async (user , issuer)=>{
    return await createLoginCredentials(user,issuer)
}


export const shareProfile = async(userId)=>{
    const account = await findOne({
        model: UserModel,
        filter : {_id:userId},
        select:"-password"
    })

    if (!account) {
        throw NotFoundExecption({message:"Invalid Shared Accoount"})
    }

    if (account.phone) {
        account.phone = await generate
    }
    return account
}