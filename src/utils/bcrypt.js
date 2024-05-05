const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const generateSalt = async () => await bcrypt.genSalt(SALT_ROUNDS);

const hashPassword = async function(password) {
    const salt = await generateSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const compareHashedPassword = async function(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}





module.exports = {
    hashPassword,
    generateSalt,
    compareHashedPassword,
};


