function mapUser(obj1, obj2) {
    if (obj2.name) {
        obj1.name = obj2.name
    }
    if (obj2.email) {
        obj1.email = obj2.email
    }
    if (obj2.username) {
        obj1.username = obj2.username
    }
    if (obj2.password) {
        obj1.password = obj2.password
    }
    if (obj2.phno) {
        obj1.phno = obj2.phno
    }
    if (obj2.dob) {
        obj1.dob = obj2.dob
    }
    if (obj2.address) {
        obj1.address = obj2.address
    }
    if (obj2.role) {
        obj1.role = obj2.role
    }

    return obj1;
}

module.exports = mapUser;