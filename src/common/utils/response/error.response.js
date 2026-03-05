import { NODE_ENV } from "../../../../config/config.service.js";

<<<<<<< HEAD

export const ErrorResponse = ({message="Error",status=400,extra=undefined}={})=>{
=======
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
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
    throw new Error(message,{cause:{status,extra}})

}

<<<<<<< HEAD

export const BadReqeustException = ({message="BadReqeustException",extra=undefined}={})=>{
    return ErrorResponse({message,status:400,extra})

}

export const UnauthorizedException = ({message="UnauthorizedException",extra=undefined}={})=>{
    return ErrorResponse({message,status:401,extra})

}

export const ForbiddenException = ({message="ForbiddenException",extra=undefined}={})=>{
    return ErrorResponse({message,status:401,extra})

}

export const ConflictExecption = ({message="Conflict",extra=undefined}={})=>{
    return ErrorResponse({message,status:403,extra})

}

export const NotFoundExecption = ({message="Not Found",extra=undefined}={})=>{
    return ErrorResponse({message,status:404,extra})

}



export const globalErrorHandling = (error, req, res, next) => {
    const status = error.cause?.status ?? 500;
    const mood = NODE_ENV == 'production';
    const defaultErrorMessage = "Something went wrong server error";
    const displayErrorMessage = error.message || defaultErrorMessage ; 
    return res.status(status).json({
        status,
        stack:mood ? undefined :error.stack,
        errorMessage: mood ? status = 500 ? defaultErrorMessage : displayErrorMessage : displayErrorMessage
        
    });
};
=======
export const ConflictExecption = ({message="Conflict",extra}={})=>{
    return ErrorExecption({message,status:409,extra})

}

export const NotFoundExecption = ({message="Not Found",extra}={})=>{
    return ErrorExecption({message,status:404,extra})

}
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
