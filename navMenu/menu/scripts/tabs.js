$import("jquery/src/layout/jquery.f1.tabs.js");
/**
 * 初始化组件
 */
(function($, undefined) {
	/**
	 * @class layout.tabs
	 * @extends core.Widget 选项卡控件，有2种表现方式:水平、垂直
	 */
	$.widget("f1.menuTabs", $.f1.tabs, {
				options : {
					fixHeight : 35
				},
				/**
				 * 修复计算SIZE
				 */
				_setSize : function() {
					var g = this, p = g.options, el = g.element, dom = g.dom; // dom=g.dom=el[0]=g.element[0];
					// var target=this.element[0];
					var opts = this.options;
					if (el.is(":hidden")) {
						p.needSize = true;
						return;
					}
					p.needSize = false;
					var header = el.children("div.tabs-header");
					opts.resizePanel = [];
					var tabs = header.find(".tabs");
					var tools = header.find(".tabs-tool");
					var width = opts.width;
					var panels = el.children(".tabs-panels");
					if (opts.fit) {
						var oPar = el.parent();
						oPar.addClass("panel-noscroll");
						opts.width = oPar.width();
						opts.height = oPar.height();
					}
					if (opts.height <= opts.minHeight) {
						opts.height = opts.minHeight;
					}
					// 修正高度
					opts.height = opts.height - p.fixHeight;
					// 如果竖直展示选项卡标题
					if (opts.vertical) {
						el.addClass("vertical");
						header._outerWidth(opts.verTitleWidth);
						header._outerHeight(opts.height);
						tabs._outerWidth(opts.verTitleWidth);
						tabs._outerHeight(opts.height);
						tools._outerWidth(opts.verTitleWidth).css(
								"margin-left", "-2px");
						el._outerHeight(opts.height);
						el.width(opts.width).height(opts.height);
						panels._outerHeight(opts.height);
						this._setScrollers();
					} else {
						el.width(opts.width).height(opts.height);
						header.css({
									"margin-left" : opts.headLeftPadding + 'px',
									"margin-right" : opts.headRightPadding
											+ 'px'
								});
						header._outerWidth(opts.width - opts.headLeftPadding
								- opts.headRightPadding);
						this._setScrollers();
						var panels = el.children("div.tabs-panels");
						var height = opts.height;
						if (!isNaN(height)) {
							// 不可见元素，高度为0,先固定-29

							var headHeight = header.height() <= 10
									? 29
									: header.outerHeight();

							if (panels.height() != (height - headHeight))
								panels._outerHeight(height - headHeight);
						} else {
							panels.height("auto");
						}
						var width = opts.width;
						if (!isNaN(width)) {
							if (panels.width() != width)
								panels._outerWidth(width);
						} else {
							panels.width("auto");
						}
					}
				}
			});
})(jQuery);
