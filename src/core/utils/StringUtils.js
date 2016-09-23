import $ from 'jquery';
import _ from 'underscore';

module.exports = {

    /**
     * 判断一个字符串是不是空字符串
     * @param str
     * @returns {boolean}
     */
    isBlank: function (str) {
        return !str || ($.trim(str).length === 0);
    },

    /**
     * 获取一个字符串中去除前后空白之后的长度
     * @param str
     * @returns {*}
     */
    charSize: function (str) {
        if (!str) {
            return 0;
        }
        return $.trim(str).length;
    },
    startsWith: function (str, starts) {
        if (starts === '') return true;
        if (str == null || starts == null) return false;
        str = "" + str;
        starts = "" + starts;
        return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function (str, ends) {
        if (ends === '') return true;
        if (str == null || ends == null) return false;
        str = "" + str;
        ends = "" + ends;
        return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    camelize: function (str) {
        return str.replace(/[-_\s]+(.)?/g, function (match, c) {
            return c.toUpperCase();
        });
    },

    toPrettyString: function (timeStr, nowTime0) {

        try {

            var floor = Math.floor;
            var minute = 60000;
            var hour = 3600000;
            var day = 86400000;
            var month = 2678400000;
            var year = 32140800000;


            var d1 = null;
            if (_.isString(timeStr)) {
                timeStr = timeStr.replace(/-/gm, '/');
                d1 = new Date(timeStr);
            }else if(_.isNumber(timeStr)){
                d1 = new Date(timeStr);
            }

            var d2 = nowTime0 ? new Date(nowTime0) : new Date();
            var t1 = d1.getTime();
            var t2 = d2.getTime();
            var diff = t2 - t1;
            //console.log(timeStr,d1,d2,t1,t2,diff);

            var r = 0;
            if (diff > year) {
                r = diff / year;
                return floor(r) + "年前";
            }
            if (diff > month) {
                r = diff / month;
                return floor(r) + "个月前";
            }
            if (diff > day) {
                r = diff / day;
                return floor(r) + "天前";
            }
            if (diff > hour) {
                r = diff / hour;
                return floor(r) + "个小时前";
            }
            if (diff > minute) {
                r = diff / minute;
                return floor(r) + "分钟前";
            }
            return "刚刚";

        }catch (e){
            return timeStr;
        }


    }

};