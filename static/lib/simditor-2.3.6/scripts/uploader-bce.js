(function (root, factory) {

  var define = null;
  var require = null;

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-uploader', ["jquery","simple-module"], function ($, SimpleModule) {
      return (root['uploader'] = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['uploader'] = factory(jQuery,SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Uploader, uploader,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Uploader = (function(superClass) {
  extend(Uploader, superClass);

  function Uploader() {
    return Uploader.__super__.constructor.apply(this, arguments);
  }

  Uploader.count = 0;

  Uploader.prototype.opts = {
    url: '',
    params: null,
    fileKey: 'upload_file',
    connectionCount: 3
  };

  Uploader.prototype._init = function() {
    this.files = [];
    this.queue = [];
    this.id = ++Uploader.count;
    this.on('uploadcomplete', (function(_this) {
      return function(e, file) {
        _this.files.splice($.inArray(file, _this.files), 1);
        if (_this.queue.length > 0 && _this.files.length < _this.opts.connectionCount) {
          return _this.upload(_this.queue.shift());
        } else {
          return _this.uploading = false;
        }
      };
    })(this));
    return $(window).on('beforeunload.uploader-' + this.id, (function(_this) {
      return function(e) {
        if (!_this.uploading) {
          return;
        }
        e.originalEvent.returnValue = _this._t('leaveConfirm');
        return _this._t('leaveConfirm');
      };
    })(this));
  };

  Uploader.prototype.generateId = (function() {
    var id;
    id = 0;
    return function() {
      return id += 1;
    };
  })();

  Uploader.prototype.upload = function(file, opts) {
    var f, i, key, len;
    if (opts == null) {
      opts = {};
    }
    if (file == null) {
      return;
    }
    if ($.isArray(file) || file instanceof FileList) {
      for (i = 0, len = file.length; i < len; i++) {
        f = file[i];
        this.upload(f, opts);
      }
    } else if ($(file).is('input:file')) {
      key = $(file).attr('name');
      if (key) {
        opts.fileKey = key;
      }
      this.upload($.makeArray($(file)[0].files), opts);
    } else if (!file.id || !file.obj) {
      file = this.getFile(file);
    }
    if (!(file && file.obj)) {
      return;
    }
    $.extend(file, opts);
    if (this.files.length >= this.opts.connectionCount) {
      this.queue.push(file);
      return;
    }
    if (this.triggerHandler('beforeupload', [file]) === false) {
      return;
    }
    this.files.push(file);
    this._xhrUpload(file);
    return this.uploading = true;
  };

  Uploader.prototype.getFile = function(fileObj) {
    var name, ref, ref1;
    if (fileObj instanceof window.File || fileObj instanceof window.Blob) {
      name = (ref = fileObj.fileName) != null ? ref : fileObj.name;
    } else {
      return null;
    }
    return {
      id: this.generateId(),
      url: this.opts.url,
      params: this.opts.params,
      fileKey: this.opts.fileKey,
      name: name,
      size: (ref1 = fileObj.fileSize) != null ? ref1 : fileObj.size,
      ext: name ? name.split('.').pop().toLowerCase() : '',
      obj: fileObj
    };
  };



  var loadStaticCache = {};
  function loadStaticJS(url, callback) {
    if (loadStaticCache[url]) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = url;
    script.type = 'text/javascript';
    script.language = 'javascript';
    script.onload = script.onreadstatechange = function () {
      callback();
      loadStaticCache[url] = true;
    };
    document.getElementsByTagName("body")[0].appendChild(script);
  };

  function createUUID() {
    var randomStr = 'xxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return randomStr + new Date().getTime();
  }


  Uploader.prototype._xhrUpload = function(file) {

    var _this = this;

    loadStaticJS('/static/lib/bce-bos-uploader.bundle.min.js',function(){

      var bosConfig = {
        credentials: {
          ak: 'f0131c5559d3415e956706caf01d1051',
          sk: 'ba90fcb9ee2441faa32f49a909192cc9'
        },
        endpoint: 'http://ubibi.gz.bcebos.com' // 根据您选用bos服务的区域配置相应的endpoint
      };
      var bucket = 'upload'; // 设置您想要操作的bucket
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
      var saveName = new Date().getTime() + '' + createUUID();

      client.putObjectFromBlob(bucket, saveName, blob, options)
          .then(function (res) {
            // 上传完成，添加您的代码
            console.log('上传成功');
            var result = {
              success: true,
              msg: null,
              file_path: 'http://ubibi.coolpeng.cn/upload/' + saveName
            };
            _this.trigger('uploadprogress', [file, 100, 100]);
            _this.trigger('uploadcomplete', [file]);
            _this.trigger('uploadsuccess', [file, result]);
            $(document).trigger('uploadsuccess', [file, result, _this]);
          })
          .catch(function (err) {
            // 上传失败，添加您的代码
            console.error(err);

            _this.trigger('uploadcomplete', [file]);

            _this.trigger('uploaderror', [file, {
              statusText: '',
              responseText: JSON.stringify({
                msg: '上传失败'
              })
            }]);
          });

      client.on('progress', function (evt) {
        // 监听上传进度
        if (evt.lengthComputable) {
          // 添加您的代码
          var percentage = (evt.loaded / evt.total) * 100;
          console.log('上传中，已上传了' + percentage + '%');
          _this.trigger('uploadprogress', [file, evt.loaded, evt.total]);
        }
      });

    })

  };

  Uploader.prototype.cancel = function(file) {
    var f, i, len, ref;
    if (!file.id) {
      ref = this.files;
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i];
        if (f.id === file * 1) {
          file = f;
          break;
        }
      }
    }
    this.trigger('uploadcancel', [file]);
    if (file.xhr) {
      file.xhr.abort();
    }
    return file.xhr = null;
  };

  Uploader.prototype.readImageFile = function(fileObj, callback) {
    var fileReader, img;
    if (!$.isFunction(callback)) {
      return;
    }
    img = new Image();
    img.onload = function() {
      return callback(img);
    };
    img.onerror = function() {
      return callback();
    };
    if (window.FileReader && FileReader.prototype.readAsDataURL && /^image/.test(fileObj.type)) {
      fileReader = new FileReader();
      fileReader.onload = function(e) {
        return img.src = e.target.result;
      };
      return fileReader.readAsDataURL(fileObj);
    } else {
      return callback();
    }
  };

  Uploader.prototype.destroy = function() {
    var file, i, len, ref;
    this.queue.length = 0;
    ref = this.files;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      this.cancel(file);
    }
    $(window).off('.uploader-' + this.id);
    return $(document).off('.uploader-' + this.id);
  };

  Uploader.i18n = {
    'zh-CN': {
      leaveConfirm: '正在上传文件，如果离开上传会自动取消'
    }
  };

  Uploader.locale = 'zh-CN';

  return Uploader;

})(SimpleModule);

uploader = function(opts) {
  return new Uploader(opts);
};

return uploader;

}));
