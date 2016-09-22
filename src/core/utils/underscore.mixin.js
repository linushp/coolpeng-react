
(function(){
    var _ = window._;
    var oldMapFunction = _.map;
    _.map = function(list, iteratee, context){
        if(_.isFunction(list.map)){
            return list.map(function(a,b,c){
                var result = null;
                try {
                    result = iteratee(a, b, c);
                }catch (e){
                }
                return result;
            });
        }
        return oldMapFunction(list, iteratee, context);
    }
})();

export function initUnderscoreMixin(functionSet){
    var _ = window._;
    _.mixin(functionSet);
}