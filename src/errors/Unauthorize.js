const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./customError");

class Unauthorize extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = Unauthorize;