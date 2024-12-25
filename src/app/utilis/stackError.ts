import config from "../config"

export const stackError = (error:any)=>{
return config.node_env === 'development' ? error.stack : undefined
}

