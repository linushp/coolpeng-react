(function (root) {


    var TYPE_ATTR = "a";

    function proto(str, type) {
        return {
            str: str,
            type: type
        }
    }

    function createAttr(attrName) {
        return function (str) {
            return proto(attrName + '="' + str + '"', TYPE_ATTR);
        }
    }

    function isTypeOf(s,type) {
        return typeof s ===type;
    }

    function push(arr,obj) {
        arr.push(obj);
    }

    function createElement(elementName,isSingle) {
        return function () {
            var attrArr = [];
            var strArr = [];
            var args = arguments;
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if(isTypeOf(arg,"string") || isTypeOf(arg,"number")){
                    push(strArr,arg);
                }
                else if(arg.type===TYPE_ATTR){
                    push(attrArr,arg.str);
                }else {
                    push(strArr,(arg && arg.toString()));
                }
            }
            if(isSingle){
                return '<'+elementName+' '+attrArr.join(" ")+'  /> ';
            }else {
                return '<'+elementName+' '+attrArr.join(" ")+'> '+strArr.join("")+'</'+elementName+'>';
            }

        }
    }

    function repeat(arr,func) {
        var mm = [];
        for(var i =0;i<arr.length;i++){
            var e = arr[i];
            mm.push(func(e,i));
        }
        return mm.join("");
    }


    var attrStr ="id,class,href,src,type,name,value,mid,oid,xid,alt,style";
    var eleStr = "div,span,p,button,a,h1,h2,h3,h4,h5,h6,header,footer,section,ul,li,ol,nav,menu";
    var eleStr2 = "input,img,br";

    var attrArr = attrStr.split(",");
    var eleArr = eleStr.split(",");
    var eleArr2 = eleStr2.split(",");
    var exportObject = {};
    for(var i=0;i<attrArr.length;i++){
        var mm = attrArr[i];
        var MM = mm.toUpperCase();
        exportObject[MM] = createAttr(mm)
    }

    for(var i=0;i<eleArr.length;i++){
        var mm = eleArr[i];
        exportObject[mm] = createElement(mm,false);
    }

    for(var i=0;i<eleArr2.length;i++){
        var mm = eleArr2[i];
        exportObject[mm] = createElement(mm,true);
    }

    exportObject["repeat"] = repeat;

    root.UbibiLib_TEMPLATE = exportObject;

})(window);
