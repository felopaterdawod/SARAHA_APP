<<<<<<< HEAD
import { createLoginCredentials } from "../../common/utils/security/token.security.js"

export const profile   = async (user)=>{
    return user
}

export const rotateToken = async (user , issuer)=>{
    return await createLoginCredentials(user,issuer)
=======
// import {users} from '../../DB/model/index.js'
export const profile   = (id)=>{
    const user = users.find(ele => ele.id == id)
    return user
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
}