import {loadStaticJS,loadStaticCSS,createUUID,StringUtils} from '../../core/utils/index';
import StaticConfig from '../../core/utils/StaticConfig';

function getSuffix (url) {
    if(!url){
        return "";
    }
    try {
        var index = url.lastIndexOf('.');
        if (index <= 0) return '';
        return url.substr(index);
    }catch (e){
        return '';
    }
}


function getUserId(){
    var userState = window.COOLPENG_USER_STATE || {};
    var userInfo = userState.userInfo || {};
    return userInfo.id || 'N';
}


function getUploadFolder() {
    var userId = getUserId();
    return "user-" + userId;
}


function onXhrUpload(file,onSuccess,onError,onProgress) {


    loadStaticJS(StaticConfig.BCE_UPLOADER_JS, function () {

        var uploadFolder = getUploadFolder();

        var baidubce = window.baidubce;

        var bosConfig = {
            credentials: {
                ak: 'f0131c5559d3415e956706caf01d1051',
                sk: 'ba90fcb9ee2441faa32f49a909192cc9'
            },
            endpoint: StaticConfig.BOS_UPLOAD_ENDPOINT // 根据您选用bos服务的区域配置相应的endpoint
        };

        var bucket = `upload/${uploadFolder}`; // 设置您想要操作的bucket
        var client = new baidubce.sdk.BosClient(bosConfig);

        //var file = evt.target.files[0]; // 获取要上传的文件
        var key = file.name; // 保存到bos时的key，您可更改，默认以文件名作为key
        var blob = file.obj;

        var ext = key.split(/\./g).pop();
        var mimeType = baidubce.sdk.MimeType.guess(ext);
        if (/^text\//.test(mimeType)) {
            mimeType += '; charset=UTF-8';
        }
        var options = {
            'Content-Type': mimeType
        };

        //var saveName = new Date().getTime() + '' + Math.floor(Math.random() * 1000000) + key;
        var saveName = createUUID(null) + getSuffix(key);

        client.putObjectFromBlob(bucket, saveName, blob, options)
            .then(function (res) {
                // 上传完成，添加您的代码
                console.log('上传成功');
                var result = {
                    success: true,
                    msg: null,
                    file_path: StaticConfig.BOS_UPLOAD_CDN_PATH + `${uploadFolder}/` + saveName
                };
                onSuccess(result);
            })
            .catch(function (err) {
                // 上传失败，添加您的代码
                console.error(err);
                onError('上传失败');
            });

        client.on('progress', function (evt) {
            // 监听上传进度
            if (evt.lengthComputable) {
                // 添加您的代码
                onProgress(evt.loaded, evt.total);
            }
        });

    })
}


exports.onXhrUpload = onXhrUpload;