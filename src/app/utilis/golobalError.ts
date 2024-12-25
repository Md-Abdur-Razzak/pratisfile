export const golobalResponseError = (success:boolean,message:string,statusCode:number,error:any,stack:any)=>{
    return {
        success,
        message,
        statusCode,
        error,
        stack
    }
}