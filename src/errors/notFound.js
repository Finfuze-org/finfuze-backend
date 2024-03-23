const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customError");

class NotFound extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND || 404;
    }
}

module.exports = NotFound