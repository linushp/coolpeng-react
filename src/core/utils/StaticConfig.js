var URL_HOST_ORIGIN = __URL_HOST_ORIGIN__;
var STATIC_FOLDER_PATH = __STATIC_FOLDER_PATH__;


var staticConfig = {
    STATIC_FOLDER_PATH:STATIC_FOLDER_PATH,
    URL_HOST_ORIGIN: URL_HOST_ORIGIN,
    BCE_UPLOADER_JS: URL_HOST_ORIGIN + '/static/lib/bce-bos-uploader.bundle.min.js',
    // SIMDITOR_CSS: __URL_HOST_ORIGIN__ + '/static/lib/combo/simditor.css',
    // SIMDITOR_JS: __URL_HOST_ORIGIN__ + '/static/lib/combo/simditor-all.min.js',
    BOS_UPLOAD_ENDPOINT: 'http://ubibi.gz.bcebos.com',
    BOS_UPLOAD_CDN_PATH: 'http://ubibi.coolpeng.cn/upload/',
    DEFAULT_AVATAR:'http://image.coolpeng.cn/static/images/default-avatar.jpg',

    bibiRobotUser:{
        uid: "-1",
        id: "1",
        username: "哔哔机器人",
        nickname: "哔哔机器人",
        avatar: "http://image.coolpeng.cn/avatar/mv-0001-1957/mv-0008.jpg"
    }
};



export default staticConfig;