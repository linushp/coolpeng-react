function joinField(fields) {
    var result = [];
    for (var i = 0; i < fields.length; i++) {
        result.push(' `' + fields[i] + '` ');
    }
    return result.join(' , ');
}


var user_select_fields = ['id', 'email', 'nickname'];
var user_insert_fields = ['email', 'nickname', 'password'];


module.exports = {

    /*UserApi*/
    "getUserCountByEmail": ["select count(0) as cc from u_user where email = ?"],
    "getUserByEmail": ["select " + joinField(user_select_fields) + " from u_user where email = ?"],
    "getUserByEmailAndPassword": ["select " + joinField(user_select_fields) + " from u_user where `email` = ? and `password`= ?"],
    "createUserAccount": ["insert into u_user(" + joinField(user_insert_fields) + ") values(?,?,?)"],
    "updateUserToken": ['update u_user set `token` = ? where `email` = ? and `password`= ? '],
    "deleteUserToken": ["update u_user set `token` = '' where `id` = ? and `token`= ? ", 'AUTO_TOKEN'],

    /*SessionApi*/
    "getMySessions": []

};