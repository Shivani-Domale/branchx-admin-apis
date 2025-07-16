const successResponse = (res, messageValue, statusCode , dataValue = {}) => {
    return res.status(statusCode).json({
        success: true,
        message:messageValue,
        status:statusCode,
        data:dataValue===null?' ':dataValue,
        error:null
    });
}  
module.exports = successResponse;