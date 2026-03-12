import joi from "joi";
import { generalValidationFields } from "../../common/utils/validation.js";


export const shareProfile = {
    params: joi.object().keys({
        userId:generalValidationFields.id.required()
    }).required()
}