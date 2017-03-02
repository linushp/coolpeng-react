
import md5 from 'rebix-utils/addon_nopack/md5'


/**
 * 对用户密码加密
 * @param plaintexts
 * @returns {*}
 */
export function encodePassword(plaintexts){
    var md51 = md5.hex_md5(plaintexts + "MD51");
    var md52 = md5.hex_md5(md51 + "MD52");
    return md52;
}