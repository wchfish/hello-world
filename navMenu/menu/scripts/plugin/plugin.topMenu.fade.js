/**
 * Created by wangc on 2017/3/6.
 */
function TopMenuFade(options) {
  this.isInit = false;
}

TopMenuFade.prototype = {
  constructor: TopMenuFade,
  init: function(component) {
    var g = this, p = g.options;
    // 插件扩展方法
    var methodConfig = {
      fadeIn: function() {
        var g = this, elem = g.element;
        g.wrap.fadeIn('slow');
      },
      fadeOut: function() {
        var g = this, elem = g.element;
        g.wrap.fadeOut('slow');
      }
    };
    $.extend(true, component, methodConfig);
    return g;
  }
};