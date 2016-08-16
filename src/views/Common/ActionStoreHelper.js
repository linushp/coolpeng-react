import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/index';
import {getObjValueInPath,isArray} from '../../core/utils';

function getObjectByConfig(obj, config) {
    var result = {};
    if (!config || !obj) {
        return null;
    }

    if (isArray(config)) {
        for (var j = 0; j < config.length; j++) {
            var conf = config[j] || '';
            if (conf.indexOf('!') !== -1) {
                conf = conf.replace('!', '');
                var x = getObjValueInPath(obj, conf) || {};
                result = Object.assign({}, result, x);
            } else {
                result[conf] = getObjValueInPath(obj, conf);
            }
        }

    } else {
        var keys = Object.keys(config);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var path = config[key] || '';
            result[key] = getObjValueInPath(obj, path);
            if (!result[key]) {
                console.log(`[ERROR]cannot get Object by key : ${key} and path: ${path} `);
            }
        }
    }
    return result;
}

export default function () {

    return function (BaseComponent) {

        var stateConfig = BaseComponent.STATE_CONFIG || {
                //'userInfo':'user.userInfo'
            };

        var actionConfig = BaseComponent.ACTION_CONFIG || {
                //'getUserInfo':'user.getUserInfo'
            };//['daohang!']


        //class NewComponent extends BaseComponent {
        //}

        function mapStateToProps(state) {
            //const {user,daohang} = state;
            return getObjectByConfig(state, stateConfig);
        }

        function mapDispatchToProps(dispatch) {
            var actions0 = getObjectByConfig(actions, actionConfig);
            return {actions: bindActionCreators(actions0, dispatch)};
        }

        return connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
        //
        //return NewComponent;
    }
}