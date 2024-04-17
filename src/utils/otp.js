const otp = () => {
    const min = 1000;
    const max = 9999
    return Math.floor(Math.random()*(max-min + 1)) + min
}

const genOtpCode = function() {
    const min = 1000;
    const max = 9999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;

    const otp = code.toString();
    return otp;
}

const otpTimeSpan = () => new Date(Date.now() + 1800000)

module.exports = {
    otp,
    genOtpCode,
    otpTimeSpan,
}

// module.exports = otp;