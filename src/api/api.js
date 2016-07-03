import 'whatwg-fetch';
import {toQueryParam} from '../utils';
var fetch = self.fetch;

const methods = [
    'get',
    'head',
    'post',
    'put',
    'del',
    'options',
    'patch'
];

function doFetch(path,method,opts,data) {
    return fetch(opts.baseURI + path, {
        method: method,
        headers: opts.headers,
        body: JSON.stringify(data)
    });
}

class _Api {

    constructor(opts) {

        this.opts = opts || {};

        if (!this.opts.baseURI)
            throw new Error('baseURI option is required');

        var that = this;
        methods.forEach(function (method) {
            this[method] = function (path, m) {

                var { params, data } =  m ||{};

                if(params){
                    var query = toQueryParam(params);
                    path  = path + query;
                }

                return new Promise(function (resolve, reject) {
                    doFetch(path,method,opts,data).then(function(res) {
                        // res instanceof Response == true.
                        if (res.ok) {
                            res.json().then(function(data) {
                                console.log('response success:',data);
                                resolve(data);
                            });
                        } else {
                            console.log("Looks like the response wasn't perfect, got status", res.status);
                            reject(res);
                        }
                    }, function(e) {
                        console.log("Fetch failed!", e);
                        reject(e);
                    });
                });
            }
        }.bind(that));
    }

}

const Api = _Api;

export default Api;
