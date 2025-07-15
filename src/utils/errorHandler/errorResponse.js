const errorResponse = (res, statusCode, errorMessage) => {
    return res.status(statusCode).json({
        success: false,
        status:statusCode,
        error:errorMessage,
        data:[]
    });
};

module.exports = errorResponse;
