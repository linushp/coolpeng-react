import {encodePassword} from './CryptUtils';
import getUniqueId from './getUniqueId';

export default function (){
    var uid = getUniqueId();
    return encodePassword(uid);
}