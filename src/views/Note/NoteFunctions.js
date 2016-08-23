import {d} from '../../core/utils/index';

var parseInt = window.parseInt;

function parsePathParams(currentPath) {

    //g11-m332-n23234-ps30-pn100-e1
    currentPath = currentPath || "";
    var result = {g: null, m: null, n: null, ps: 30, pn: 1};
    var pathArr = currentPath.split('-');
    for (var i = 0; i < pathArr.length; i++) {
        var p = pathArr[i];
        if ((/^c/i).test(p)) {
            var num = p.replace('c', '');
            result['c'] = num;
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
        c: numberNotEqual(pp1.c, pp2.c),
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

function toMapCategoryList(CategoryList,map){
    if(CategoryList){
        CategoryList.forEach(function(c) {
            var id = c.get('id');
            map[id] = c;
            var children = c.get('children');
            if(children){
                toMapCategoryList(children,map);
            }
        });
    }
}

function getCategoryPath(M,CategoryList){
    var map = {};
    toMapCategoryList(CategoryList,map);
    var result = [];
    result.push(M.toJS());
    var parentId = M.get('parentId');
    if(parentId){
        var parentObj = map[parentId];
        while (parentObj){
            result.push(parentObj.toJS());
            parentId = parentObj.get('parentId');
            if(parentId){
                parentObj = map[parentId];
            }else {
                parentObj = null;
            }
        }
    }
    return result;
}


function getCategoryIdPath(id,CategoryList){
    var map = {};
    toMapCategoryList(CategoryList,map);
    var M = map[id];
    var categoryPath = getCategoryPath(M,CategoryList);
    var path = categoryPath.map(function(c){
        return "S"+c[id]+"E";
    });
    return path.join(" ")
}




module.exports = {
    getCategoryIdPath:getCategoryIdPath,
    getCategoryPath:getCategoryPath,
    parsePathParams: parsePathParams,
    isPathParamChanged: isPathParamChanged,
    toPathParamString: toPathParamString
};