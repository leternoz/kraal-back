class User {
    constructor(email, memberId, password, person) {
        this.email = email;
        this.memberId = memberId;
        this.password = password;
        this.person = person;
    }
}

module.exports = { User }