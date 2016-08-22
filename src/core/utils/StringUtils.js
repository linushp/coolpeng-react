import $ from 'jquery';

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
    }
};