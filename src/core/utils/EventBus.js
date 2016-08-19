var eventListenerContainer = [];
module.exports = {

    addEventListener: function (eventName, listener) {
        eventListenerContainer.push({
            eventName: eventName,
            listener: listener
        });
    },

    removeEventListener: function (eventName, listener) {
        var result = [];
        for (var i = 0; i < eventListenerContainer.length; i++) {
            var m = eventListenerContainer[i];
            if (m.eventName === eventName && m.listener === listener) {
                //skip
            } else {
                result.push(m);
            }
        }
        eventListenerContainer = result;
    },

    emit: function (eventName, m1, m2, m3, m4, m5) {
        for (var i = 0; i < eventListenerContainer.length; i++) {
            var m = eventListenerContainer[i];
            if (m.eventName === eventName && m.listener) {
                m.listener(m1, m2, m3, m4, m5);
            }
        }
    }

};