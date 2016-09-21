
(function(_){

    var oldMapFunction = _.map;

    _.map = function(list, iteratee, context){
        if(_.isFunction(list.map)){
            return list.map(iteratee,context);
        }
        return oldMapFunction(list, iteratee, context);
    }

})(window._);