const bcrypt = require('bcrypt');

const hashPassword = async function(password) {
    const saltRounds =  10;
    const salt = await  bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// console.log(`hashedPassword: ${ hashPassword('sdk232lsa')}`);

module.exports = hashPassword;

// const start = async function() {

//     console.log(await hashPassword('seil2Asil'));
// }

// start();
