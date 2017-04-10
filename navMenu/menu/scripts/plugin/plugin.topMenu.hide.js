/**
 * Created by wangc on 2017/3/6.
 */
function TopMenuHide(options) {
  this.isInit = false;
}

TopMenuHide.prototype = {
  constructor: TopMenuHide,
  init: function(component) {
    var g = this, p = g.options;
    // 插件扩展方法
    var methodConfig = {
      hide: function() {
        var g = this, elem = g.element;
        g.wrap.hide('slow');
      },
      show: function() {
        var g = this, elem = g.element;
        g.wrap.show('slow');
      }
    };
    $.extend(true, component, methodConfig);
    return g;
  }
};