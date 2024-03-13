const sendCookieToken = async (user,status,res)=>{
    const token = await user.getJWTtoken();
    const cookieOptions = 
    {
        expires:new Date(Date.now() + process.env.cookieExpire * 24 * 60 * 60 * 1000 ),
        httpOnly:true,
        sameSite:'None',
    }
    res.status(status).cookie("token",token,cookieOptions).json({sucess:true,user,token});

}
module.exports = sendCookieToken;