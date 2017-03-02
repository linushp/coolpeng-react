import {getRandomNum} from 'rebix-utils';


/**
 * 逆转字符串
 * @param str
 * @returns {string}
 */
function reverseString(str) {
    str = str || "";
    var len = str.length;
    var newStr = [];
    for (var i = len - 1; i >= 0; i--) {
        newStr.push(str[i]);
    }
    return newStr.join("");
}

/**
 * 获取一个随机的指定长度的数字字符串
 * @param min
 * @param max
 * @param len
 * @returns {string}
 */
export default function getRandomNumString(min, max, len) {
    var num = "" + getRandomNum(min, max);
    num = reverseString(num);
    var str = [];
    for (var i = 0; i < len; i++) {
        str[i] = num[len - i - 1] || "0";
    }
    return str.join("");
}