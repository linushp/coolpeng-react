function joinField(fields) {
    var result = [];
    for (var i = 0; i < fields.length; i++) {
        result.push(' `' + fields[i] + '` ');
    }
    return result.join(' , ');
}


var user_select_fields = ['id', 'email', 'nickname', 'avatar'];
var user_insert_fields = ['email', 'nickname', 'password', 'avatar'];
var session_insert_fields = ['uid', 'session_type', 'session_id','to_sid', 'session_name', 'last_time'];
var publicChart_insert_fields = ['topic', 'desc', 'avatar'];

module.exports = {

    /*UserApi*/
    "getUserCountByEmail": ["select count(0) as cc from u_user where email = ?"],
    "getUserByEmail": ["select " + joinField(user_select_fields) + " from u_user where email = ?"],
    "getUserByEmailAndPassword": ["select " + joinField(user_select_fields) + " from u_user where `email` = ? and `password`= ?"],
    "getUserByUidInList": ["select " + joinField(user_select_fields) + " from u_user where `id` in (?)  "],
    "createUserAccount": ["insert into u_user(" + joinField(user_insert_fields) + ") values(?,?,?,?)"],
    "updateUserToken": ['update u_user set `token` = ? where `email` = ? and `password`= ? '],
    "deleteUserToken": ["update u_user set `token` = '' where `id` = ? and `token`= ? ", 'AUTO_TOKEN'],

    /*SessionApi*/
    "getMySessions": ['select * from u_sessions where uid=? order by last_time desc'],
    "updateSessionLastTime": ['update u_sessions set last_time=? where id = ?'],
    "createSession": ["insert into u_sessions(" + joinField(session_insert_fields) + ") values(?,?,?,?,?) "],
    "deleteSession": ["delete u_sessions where id = ? and uid= ?", "AUTH_UID"], //只能删除我自己的会话


    /*MessageApi*/
    'getMessageListBySessionId': ['select * u_messages where session_id = ? order by `time` desc limit ?,?'],
    "deleteMessageById": ['delete u_messages where id=? and f_uid = ?', 'AUTH_UID'],//只能删除我自己发的消息


    /*PublicChatApi*/
    'createPublicChat': ["insert into u_public_chat(" + joinField(publicChart_insert_fields) + ") values(?,?,?)"], //TODO 需要删除
    'getPublicChatList': ["select * from u_public_chat"]

};