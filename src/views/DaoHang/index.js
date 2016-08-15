module.exports = {
    path: 'daohang',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./DaoHang'))
        })
    }
};
