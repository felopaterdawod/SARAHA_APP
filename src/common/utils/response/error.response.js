import { NODE_ENV } from "../../../../config/config.service.js";

export const globalErrorHandling = (error, req, res, next) => {
    const status = error.cause?.status ?? 500;
    return res.status(status).json({
    error_message:
        status == 500
        ? "something went wrong"
        : (error.message ?? "something went wrong"),
    stack: NODE_ENV == "development" ? error.stack : undefined,
    });
};

export const ErrorExecption = ({message="Fail",status=400,extra=undefined}={})=>{
    throw new Error(message,{cause:{status,extra}})

}

export const ConflictExecption = ({message="Conflict",extra}={})=>{
    return ErrorExecption({message,status:409,extra})

}

export const NotFoundExecption = ({message="Not Found",extra}={})=>{
    return ErrorExecption({message,status:404,extra})

}