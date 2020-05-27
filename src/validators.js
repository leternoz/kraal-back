const isValidEmail = (input) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input));
}

const isValidMemberId = (input) => {
    return !isNaN(input);
}

module.exports = {isValidEmail, isValidMemberId};