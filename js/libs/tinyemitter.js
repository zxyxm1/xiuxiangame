// TinyEmitter - ES6 Module Version
function TinyEmitter() {}

TinyEmitter.prototype = {
  on: function(event, callback, ctx) {
    var e = this.e || (this.e = {});
    (e[event] || (e[event] = [])).push({
      fn: callback,
      ctx: ctx
    });
    return this;
  },

  once: function(event, callback, ctx) {
    var self = this;
    function listener() {
      self.off(event, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(event, listener, ctx);
  },

  emit: function(event) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[event] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function(event, callback) {
    var e = this.e || (this.e = {});
    var evts = e[event];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    liveEvents.length ? e[event] = liveEvents : delete e[event];
    return this;
  }
};

export default TinyEmitter;
