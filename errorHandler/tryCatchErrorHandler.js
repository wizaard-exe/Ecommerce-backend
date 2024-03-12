// const tryCatchErrorHandler = (fun) => (req,res,next)=>
// {
//     return Promise.resolve(fun(req,res,next)).catch(next)
// }

const tryCatchErrorHandler = (func) =>{
    return (req,res,next)=>{
        func(req,res,next).catch(err =>next(err));
    }
}

module.exports = tryCatchErrorHandler;