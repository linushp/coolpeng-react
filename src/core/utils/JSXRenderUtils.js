
function showStyle(isShow, style) {
    style = style || {};
    return {
        display: isShow ? 'block' : 'none',
        ...style
    };
}


function hideStyle(isHide, style) {
    style = style || {};
    if(isHide){
        style['display'] = "none";
    }
    return style;
}


module.exports = {
    hideStyle:hideStyle,
    showStyle:showStyle
};