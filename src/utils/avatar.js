(function () {

    function createAvatarAlbumModel(albumName, prefix, begin, end) {
        var strArr = albumName.split("-");

        prefix = prefix || strArr[0];
        begin = begin || parseInt(strArr[1],10);
        end = end || parseInt(strArr[2],10);

        return {
            albumName: albumName,
            prefix: prefix,
            begin: begin,
            end: end,
            count: end - begin + 1,
            indexBegin: null,
            indexEnd: null
        }
    }


    var avatarModels = [
        //createAvatarAlbumModel("aa-0001-0504", "aa", 1, 504),
        //createAvatarAlbumModel("mv-0001-1957", "mv", 1, 1957)
        createAvatarAlbumModel("aa-0001-0504"), //默认
        createAvatarAlbumModel("dw-0001-0500"), //动物
        createAvatarAlbumModel("dw-0501-1000"), //动物
        createAvatarAlbumModel("dw-1001-1311"), //动物
        createAvatarAlbumModel("fj-0001-0425"), //风景
        createAvatarAlbumModel("kt-0001-1040"), //卡通
        createAvatarAlbumModel("lb-0001-0460"), //蜡笔小新
        createAvatarAlbumModel("LL-0001-0320"), //萝莉
        createAvatarAlbumModel("lz-0001-1000"), //龙珠
        createAvatarAlbumModel("mm-0001-0600"), //美女2
        createAvatarAlbumModel("mv-0001-1957"), //美女
        createAvatarAlbumModel("mx-0001-0188"), //美胸
        createAvatarAlbumModel("ns-0001-0269"), //女生
        createAvatarAlbumModel("xf-0001-0101")  //校服

    ];

    function calculateIndex() {
        var mm = avatarModels[0];
        mm.indexBegin = 1;
        mm.indexEnd = (mm.count);
        var length = avatarModels.length;
        for (var i = 1; i < length; i++) {
            var m0 = avatarModels[i - 1];
            var m1 = avatarModels[i];
            m1.indexBegin = (m0.indexBegin + 1);
            m1.indexEnd = (m0.indexEnd + m1.count);
        }
    }

    calculateIndex();


    function getRandomAvatarUrlList(count) {
        var avatarSet = {};

        var isFill = false;
        for (var i = 0; i < 100; i++) {
            if (!isFill) {
                isFill = putRandomAvatarURL(avatarSet, count);
            }
        }

        var avatarList = Object.getOwnPropertyNames(avatarSet);
        return avatarList.slice(0, count);
    }


    function getAvatarSetSize(m) {
        return Object.getOwnPropertyNames(m).length;
    }

    function putRandomAvatarURL(avatarSet, count) {
        if (getAvatarSetSize(avatarSet) < count) {
            var loopCount = count * 2;
            for (var i = 0; i < loopCount; i++) {
                var url = getRandomAvatarURL();
                avatarSet[url] = true;
            }
            return false;
        }
        return true;
    }


    function getRandomAvatarURL() {
        var m = getRandomAvatarAlbum();
        var randomNumber = getRandomNumber(m.begin, m.end);
        var fileName = m.prefix + "-" + formatNumber(randomNumber) + ".jpg";
        //http://coolpeng.bj.bcebos.com/avatar/aa-0001-0504/aa-0001.jpg
//        return "http://coolpeng.bj.bcebos.com/avatar/" + m.albumName + "/" + fileName;
        return m.albumName + "/" + fileName;
    }


    function formatNumber(num) {
        if (num < 10) {
            return "000" + num;
        }

        if (num < 100) {
            return "00" + num;
        }

        if (num < 1000) {
            return "0" + num;
        }
        return "" + num;
    }

    function getRandomNumber(min, max) {
        var randomNumber = parseInt(Math.random() * max, 10) + min;
        return randomNumber;
    }


    function getRandomAvatarAlbum() {

        var lastAlbum = avatarModels[avatarModels.length - 1];

        var randomNumber = getRandomNumber(1, lastAlbum.indexEnd);

        var length = avatarModels.length;
        for (var i = 0; i < length; i++) {
            var m = avatarModels[i];
            if (m.indexBegin <= randomNumber && randomNumber <= m.indexEnd) {
                return m;
            }
        }

        console.log("default:" + randomNumber);
        return avatarModels[0];
    }

    var willExport = {
        getRandomAvatarURL: getRandomAvatarURL,
        getRandomAvatarUrlList: getRandomAvatarUrlList
    };



    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = willExport;
    } else {
        window.coolpengAvatarService = window.coolpengAvatarService || {};
        Object.assign(window.coolpengAvatarService, willExport)
    }

})();