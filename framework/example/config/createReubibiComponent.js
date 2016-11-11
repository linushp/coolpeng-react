import Reubibi from '../../reubibi/src/index';
import reubibiConfigure from './reubibiConfigure';

export default function createReubibiComponent(BaseComponentImpl, componentConfig) {
    return Reubibi.createComponent(reubibiConfigure, BaseComponentImpl, componentConfig);
}