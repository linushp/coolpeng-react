import isPromise  from '../utils/isPromise';


export default function promiseMiddleware(_ref) {

    const dispatch = _ref.dispatch;

    return next => action => {

        if (!isPromise(action.payload)) {
            action.status = 'success';
            return next(action);
        }

        const {type,group,name,status,args,payload} = action;
        const promise = payload;

        const createAction = function (status1, payload1) {
            return {
                type: type,
                group: group,
                name: name,
                status: status1,
                args: args,
                payload: payload1 //object or promise
            };
        };

        action.payload = promise.then(
            (resolved = {}) => {
                var successAction = createAction('success', resolved);
                return dispatch(successAction);
            },

            (rejected = {}) => {
                var successAction = createAction('error', rejected);
                return dispatch(successAction);
            }
        );


        var pendingAction = createAction('pending', null);
        return next(pendingAction);
    };

}
