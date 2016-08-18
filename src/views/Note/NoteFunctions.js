var parseInt = window.parseInt;

function parsePathParams(currentPath) {

    //g11-m332-n23234-ps30-pn100-e1
    currentPath = currentPath || "";
    var result = {g: null, m: null, n: null, ps: 30, pn: 1};
    var pathArr = currentPath.split('-');
    for (var i = 0; i < pathArr.length; i++) {
        var p = pathArr[i];
        if ((/^g/i).test(p)) {
            var num = p.replace('g', '');
            result['g'] = num;
        }
        if ((/^m/i).test(p)) {
            var num = p.replace('m', '');
            result['m'] = num;
        }
        if ((/^n/i).test(p)) {
            var num = p.replace('n', '');
            result['n'] = num;
        }
        if ((/^ps/i).test(p)) {
            var num = p.replace('ps', '');
            result['ps'] = num;
        }
        if ((/^pn/i).test(p)) {
            var num = p.replace('pn', '');
            result['pn'] = num;
        }

        if ((/^e/i).test(p)) {
            var num = p.replace('e', '');
            result['e'] = num;
        }
    }
    return result;
}

function numberNotEqual(a, b) {

    if (a == b) {
        return false;
    }

    if(!a && !b){
        return false;
    }

    a = parseInt(a, 10);
    b = parseInt(b, 10);

    if(!a && !b){
        return false;
    }
    console.log(a, b);
    return a !== b;
}

function isPathParamChanged(p1, p2) {
    var pp1 = parsePathParams(p1);
    var pp2 = parsePathParams(p2);
    return {
        g: numberNotEqual(pp1.g, pp2.g),
        m: numberNotEqual(pp1.m, pp2.m),
        n: numberNotEqual(pp1.n, pp2.n),
        ps: numberNotEqual(pp1.ps, pp2.ps),
        pn: numberNotEqual(pp1.pn, pp2.pn),
        e: numberNotEqual(pp1.e, pp2.e)
    };
}


function toPathParamString(p,paramKeyArr) {
    var arr = [];
    for(var i=0;i<paramKeyArr.length;i++){
        var key = paramKeyArr[i];
        var vvv = p[key];
        if(vvv){
            arr.push(key+''+ vvv);
        }
    }
    return arr.join('-');
}


/**
 *
 * @param pathParams
 * @param CategoryList ImmutableJS List
 */
function getCurrentCategoryByPath(pathParams, CategoryList) {
    if (pathParams.g) {
        var mm, gg;
        gg = CategoryList.find(function (v, k) {
            return v.get('id') === pathParams.g;
        });
        if (pathParams.m && gg) {
            var children = gg.get('children');
            mm = children.find(function (v) {
                return v.get('id') === pathParams.m;
            });
        }
        return mm || gg || null;
    }

    return null;
}


module.exports = {
    parsePathParams: parsePathParams,
    getCurrentCategoryByPath: getCurrentCategoryByPath,
    isPathParamChanged: isPathParamChanged,
    toPathParamString: toPathParamString
};