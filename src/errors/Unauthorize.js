const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customError");

class UnauthorizeError extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizeError;