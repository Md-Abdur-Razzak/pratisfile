export const golobalResponseSend = (success:boolean,message:string,statusCode:number,data:any)=>{
    
    return {
        success,
        message,
        statusCode,
       data
    }
}