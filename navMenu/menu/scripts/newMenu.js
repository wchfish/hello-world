/**
* 三级菜单
*/
function NewMenu( dom, options ) {
 	//为了服用平台组件的代码进行的初始化
 	this.dom = dom;
 	this.element = $( this.dom );
 	this.el = this.element;

 	this.options = {
 		//菜单项的数据
 		data : {},
 		//一级菜单项高度
		primaryHeight : 35,
		//二级菜单项高度 
		secondHeight : 40,
		/**
 		* 菜单项点击事件
 		* @param {object} e jquery事件对象
 		* @param {object} args args.sender是当前对象实例 
 		*/
		onMenuItemClick : null
 	};
	if (typeof options === 'object') {
		$.extend( this.options, options );
	}
 	this._create();
}

NewMenu.prototype = {
	constructor : NewMenu,
	_create : function() {
		this._render();
		this._init();
	},
	_render : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom; 
		var wrap, wrapContentHtml, menuStr,
			menuSecondStr, menuData;

		// 生成菜单
		menuStr = g._buildMenuHtml();
		el.html( menuStr.menuPrimaryStr ).addClass( "menu" );
		// 生成菜单的外部结构
		el.wrap( '<div class="menu-wrap clearfix"></div>' );
		// 在组件实例中存储dom元素
		g.wrap = wrap = el.parent();
		wrap.append( '<a class="icon icon-arrow-left menu-btn menu-btn-left" href="javascript:void(0);"></a>' )
			.append( '<a class="icon icon-arrow-right menu-btn menu-btn-right" href="javascript:void(0);"></a>' )
			.append( menuStr.menuSecondStr );
		g.menuPrimary = el.find( ".menu-primary" );
		g.leftBtn = g.wrap.find( ".menu-btn-left" );
		g.rightBtn = g.wrap.find( ".menu-btn-right" );

	},
	_init : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var menuWidth;

		menuWidth = g.wrap.width() - g.leftBtn.width() - g.rightBtn.width();
		el.width( menuWidth );
		g.maxMenuWidth = menuWidth;

		//初始化事件
		g._initEvents();

		g._setMenuHeight(p.primaryHeight);

		//根据菜单数据设置一级菜单宽度
		g._setMenuPrimaryWidth();

		//修正菜单宽度（使宽度正好等于当前显示项的宽度之和）
		g._setMenuWidth( g.primaryItemsShowed.start );

		//设置当前的按钮状态
		g._setBtn();

		//初始化三级菜单
		g._initMenuThird();

		//初始化二级菜单
		g._initMenuSecond();

		//隐藏二级菜单
		el.parent().find( '.menu-second-box' ).css( 'display', 'none' );
		el.parent().find( '.menu-second' ).css( 'display', 'none' );
	},
	/**
	* 初始化事件
	*/
	_initEvents : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		
		var timeout, startTime, currentTime, limitTime = 500;
		var menuWidth;
	
		g._initBtnEvents();
		g._initMenuPrimaryEvents();

		//菜单项点击事件
		g.wrap.off( 'click.menuItem' );
		g.wrap.on( 'click.menuItem', 'a', function( e, args ) {
			var menuItem = $( this );
			var url = menuItem.attr( 'data-url' );
			if ( url != null ) {
				var id = menuItem.attr( 'id' ), text = menuItem.text();
				var _args = {
					sender : g,
					url : url,
					id : id,
					text : text
				};

				//不使用平台组件的方法触发自定义事件
				p.onMenuItemClick( e, _args );
				return false;	
			} 
		} );

		//优化的resize事件处理,应该单独提出来
		$( window ).resize( function() {

			currentTime = new Date();
			if ( startTime && currentTime.getTime() - startTime.getTime() >= limitTime ) {
				satrtTime = null;
				clearTimeout( timeout );
				//处理resize事件的代码
				if ( true ) {
					menuWidth = g.wrap.width() - g.leftBtn.width() - g.rightBtn.width();
					el.width( menuWidth );
					g.maxMenuWidth = menuWidth;
					g._setMenuWidth( g.primaryItemsShowed.start );
					g._setBtn();
				}	
			} else {
				startTime = startTime || new Date();
				timeout && clearTimeout( timeout );
				timeout = setTimeout( function() {
					satrtTime = null;
					
					if ( true ) {
						menuWidth = g.wrap.width() - g.leftBtn.width() - g.rightBtn.width();
						el.width( menuWidth );
						g.maxMenuWidth = menuWidth;
						g._setMenuWidth( g.primaryItemsShowed.start );
						g._setBtn();
					}
				}, 300);
			}	
		});
	},
	/**
	* 初始化按钮点击事件
	*/
	_initBtnEvents : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var hasClicked = false;

		g.leftBtn.off( 'click.menu' );
		g.leftBtn.on( 'click.menu', function( e, args ) {
			if ( hasClicked ) {
				return ;
			} else {
				var menuWidth, menuPrimaryLeft, left;
				
				//设置重复点击标识
				hasClicked = true;

				//隐藏正在显示的二级菜单
				$( '.menu-second' ).css( { display : 'none' } );

				//计算菜单移动距离
				g._setMenuWidth( g.primaryItemsShowed.start - 1, 'left' );
				menuWidth = parseInt( el.width() );
				menuPrimaryLeft = g.menuPrimary.position().left;
				left = menuPrimaryLeft + menuWidth;

				//如果左移回到第一列，需要对菜单宽度进行修正
				if ( g.primaryItemsShowed.start == 0 ) {
					g._setMenuWidth( g.primaryItemsShowed.start, 'right' );	
				}

				//菜单移动
				g.menuPrimary.animate({
					left : left + 'px',
					},'fast', function() {	
					g._setBtn();
					hasClicked = false;
				});
			}
		});

		g.rightBtn.off( 'click.menu' );
		g.rightBtn.on( 'click.menu', function( e, args ) {
			if ( hasClicked ) {
				return ;
			} else {
				var menuWidth, menuPrimaryLeft, left;
				
				//设置重复点击标识
				hasClicked = true;

				//隐藏正在显示的二级菜单
				$( '.menu-second' ).css( { display : 'none' } );

				//计算菜单移动距离
				menuWidth = parseInt( el.width() );
				menuPrimaryLeft = g.menuPrimary.position().left;
				left = menuPrimaryLeft - menuWidth;

				// 移动前修改菜单宽度，优化动画显示效果
				g._setMenuWidth( g.primaryItemsShowed.end + 1, 'right' );

				//菜单移动
				g.menuPrimary.animate({
					left: left + 'px'
					},'fast', function() {
					// g._setMenuWidth( g.primaryItemsShowed.end + 1, 'right' );
					g._setBtn();
					hasClicked = false;
				});
			}
		});	
	},
	/**
	* 初始化一级菜单点击事件
	*/
	_initMenuPrimaryEvents : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;

		// 绑定事件前先解绑，避免重复绑定
		g.wrap.off( 'click.menuPrimary', '.menu-primary-item-a' );
		g.wrap.on( 'click.menuPrimary', '.menu-primary-item-a' , function( e, args ) {
			var $primaryItem, dataIndex, $menuSecond, $menuSecondBox; 
			var offsetLeft, menuSecondLeft, isBlock, position;

			$primaryItem = $( this );
			dataIndex = $primaryItem.attr( 'data-index' );
			$menuSecond = $( '.menu-second[data-index=' + dataIndex + ']');
			$menuSecondBox = $( '.menu-second-box' );	

			// e.stopPropagation();

			isBlock = $menuSecond.css( 'display' ) == 'block';
			if ( isBlock ) {
				//重复点击菜单项隐藏二级菜单
				$menuSecondBox.css( { display : 'none' } );
				$menuSecond.css( { display : 'none' } );
				$primaryItem.removeClass( 'active');	

			} else {
				//隐藏正在显示的二级菜单
				$( '.menu-second' ).css( { display : 'none' } );
				$( '.menu-primary-item-a' ).removeClass( 'active' );

				//计算二级菜单定位的位置
				position = g._setMenuSecondPosition( $menuSecond[0] );
				$menuSecondBox.css( 'left', '' ).css( 'right', '' );
				$menuSecondBox.css( position );

				//修正menu-second-box宽度
				$menuSecondBox.width( $menuSecond.width() );
				
				//弹出二级菜单
				$menuSecondBox.css( { display : 'block' } );
				$menuSecond.css( { display : 'block' } );	
				$primaryItem.addClass( 'active' );
			}		
		});

		//点击其他位置时隐藏显示的二级菜单
		$( document.body ).on( 'click', function( e, args ) {
			var isPrimaryItem = $( e.target ).hasClass( 'menu-primary-item-a' );
			if ( !isPrimaryItem ) {
				$( '.menu-second' ).css( { display : 'none' } );
				$( '.menu-second-box' ).css( { display : 'none' } );	
				$( '.menu-primary-item-a' ).removeClass( 'active' );
			}
		});
	},
	/**
	* 构建菜单的html结构
	*/
	_buildMenuHtml : function() {
		var g = this, p = g.options, dom = g.dom;
		var menuData, menuPrimaryStr, menuSecondStr;

		// 根据菜单数据渲染dom结构
		if ( p.data ) {
			// 原平台菜单的数据获取过程需用此句代码
			// menuData = p.data.menus;

			// 配合四级菜单的数据获取
			menuData = p.data;

			menuPrimaryStr = '<ul class="menu-primary clearfix">';
			menuSecondStr = '<div class="menu-second-box" style="display:block;">';
			$.each( menuData, function( index, primaryItem ) {
				
				//构建一级菜单html结构
				menuPrimaryStr += '<li class="menu-primary-item">';
				if ( primaryItem.url != null && primaryItem.url != '' && primaryItem.url != undefined ) {
					menuPrimaryStr += '<a class="menu-primary-item-a" href="javascript:void(0);" id="'
									+ primaryItem.id + '" data-url="' + primaryItem.url + '" data-index="' + index + '">' + primaryItem.text + '</a></div>';		
				} else {
					menuPrimaryStr += '<a class="menu-primary-item-a" href="javascript:void(0);" id="'
									+ primaryItem.id + '" data-index="' + index + '">' + primaryItem.text + '</a></div>';	
				}
				if ( primaryItem.menu && primaryItem.menu.length > 0) {

					//构建二级菜单html结构
					menuSecondStr += '<ul class="menu-second" data-index="' + index + '" style="display:block;">';
					$.each( primaryItem.menu, function( index, secondItem ) {
						menuSecondStr += '<li class="menu-second-item clearfix">';
						if ( secondItem.url != null && secondItem.url != '' && secondItem.url != undefined ) {
							menuSecondStr += '<a class="menu-second-item-a  end-nav-item-a" href="javascript:void(0);" id="'
						 					+ secondItem.id + '" data-url="' + secondItem.url + '">' + secondItem.text + '</a>'; 	
						} else {
							menuSecondStr += '<a class="menu-second-item-a" href="javascript:void(0);" id="'
						 					+ secondItem.id + '">' + secondItem.text + '</a>'; 	
						}
						if ( secondItem.menu && secondItem.menu.length > 0 ) {

							//构建三级菜单html结构
							menuSecondStr += '<ul class="menu-third">';
							$.each( secondItem.menu, function( index, thirdItem ) {
								menuSecondStr += '<li class="menu-third-item"><a class="menu-third-item-a" href="javascript:void(0);" id="'
									 			+ thirdItem.id + '" data-url="' + thirdItem.url + '" title="' + thirdItem.text + '">' + thirdItem.text + '</a>';
							});
							menuSecondStr += '</ul>';
						}

						menuSecondStr += '</li>';
					});
					menuSecondStr += '</ul>';
				}
			});
			menuPrimaryStr += '</ul>';
			menuSecondStr += '</div>';
			return { menuPrimaryStr : menuPrimaryStr, menuSecondStr : menuSecondStr };
		}
	},
	/**
	* 设置菜单高度
	*/
	_setMenuHeight : function(height) {
		var g = this, p = g.options, dom = g.dom;
		g.wrap.height(height);
		return g.wrap.height();
	},
	/**
	* 设置一级菜单宽度
	*/
	_setMenuPrimaryWidth : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var menuPrimaryWidth = 0;
		var showedWidth = 0;

		g.primaryItemsWidth = [];
		g.primaryItemsShowed = { start : 0, end : null };
		
		el.find( ".menu-primary-item").each( function( index, primaryItem ) {
			g.primaryItemsWidth[ index ] = $( primaryItem ).outerWidth();
			menuPrimaryWidth += g.primaryItemsWidth[ index ];
		});
		g.menuPrimary.width( menuPrimaryWidth );	
		g.menuPrimaryWidth = menuPrimaryWidth;			
	},
	/**
	* 设置菜单宽度
	*/
	_setMenuWidth : function( startIndex, direction ) {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var menuWidth = g.maxMenuWidth, showedWidth = 0, changeValue;
		direction = direction || 'right';

		//根据起始位置索引设置新的菜单宽度
		changeValue = direction === 'right'? 1: -1;
		for (  var i = startIndex, len = g.primaryItemsWidth.length; i < len && i >= 0; ) {
			if ( showedWidth + g.primaryItemsWidth[ i ] <= g.maxMenuWidth ) {
				showedWidth += g.primaryItemsWidth[ i ];	
				
			} else {
				menuWidth = showedWidth;
				break;	
			}

			//手动改变i
			i = i + changeValue;
		}

		//设置起始位置和结束位置
		if ( direction == 'right' ) {
			g.primaryItemsShowed.start = startIndex;
			g.primaryItemsShowed.end = i - 1;	
		} else {
			g.primaryItemsShowed.start = i + 1;
			g.primaryItemsShowed.end = startIndex;		
		}

		el.width( showedWidth );
	},
	/**
	* 设置按钮状态
	*/
	_setBtn : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var menuOffsetLeft, menuPramaryOffsetLeft, menuWidth;

		menuPramaryOffsetLeft = g.menuPrimary.offset().left;
		menuOffsetLeft = el.offset().left;
		menuWidth = el.outerWidth();

		//判断按钮是否需要显示
		if ( menuPramaryOffsetLeft < menuOffsetLeft ) {
			g.leftBtn.css( "display", "block" );	
		} else {
			g.leftBtn.css( "display", "none" );	
		}	
		if ( g.menuPrimaryWidth + menuPramaryOffsetLeft > menuOffsetLeft + menuWidth ) {
			g.rightBtn.css( "display", "block" );
		} else {
			g.rightBtn.css( "display", "none" );	
		}
	},
	/**
	* 初始化二级菜单
	*/
	_initMenuSecond : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		
		g._initMenuSecondItemSize();
		g._initmenuSecondSize();


	},
	/**
	* 初始化二级菜单项的宽度和高度
	*/
	_initMenuSecondItemSize : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var menuData, maxWidth, maxLength, maxItemId, primaryItemId,
			dataIndex, $menusecond, $primaryItem;
		//根据p.data获取每个二级菜单中最大的二级菜单项,并设置宽度
		// 原平台数据格式
		// menuData = p.data.menus;

		// 四级菜单数据格式
		menuData = p.data;

		$.each( menuData, function( index, primaryItem ) {
			dataIndex = index;
			maxWidth = 0;
			maxLength = 0;
			primaryItemId = primaryItem.id;
			primaryItemLength = primaryItem.text.length;
			$primaryItem = $( '#' + primaryItemId );
			
			//查找字数最多的二级菜单项
			if( primaryItem.menu ) {
				$.each( primaryItem.menu, function( index, secondItem) {
					if ( maxLength < secondItem.text.length ) {
						maxLength = secondItem.text.length;
						maxItemId = secondItem.id;	
					}
				});	
			}
		
			//修改二级菜单项的宽度和高度
			maxWidth = $( '#' + maxItemId ).outerWidth();
			if ( maxWidth < $primaryItem.outerWidth() - 2 ) {
				maxWidth = $primaryItem.outerWidth() - 2;
			}

			$menuSecond = $( '.menu-second[data-index=' + dataIndex + ']');
			$menuSecond.find( '.menu-second-item-a' ).each( function( index, item ) {
				$( item ).outerWidth( maxWidth );
				$( item ).outerHeight( $( item ).parent().outerHeight() );
			});
			
		});
	},
	/**
	* 初始化二级菜单的宽和高
	*/
	_initmenuSecondSize : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
        // 修改二级菜单项最大宽度的判断方法
				var maxThirdMenuWidth = 614;
				// var maxWidth = 595;
        var minBoxHeight = 108;
        var maxBoxHeight = 382;
        var newBoxHeight = 379;
        var maxSecondNavHeight = 343;

        var lineItemsNumber = 4;
        el.parent().find( '.menu-second' ).each( function( i ) {
						var maxWidth;
            var navWidth = 0;
            var maxNavWidth = 0;
            var totalHeight = 10;
            var _i = i;
            var navSecondBox = $( this ).parent();
            var navSecond = $( this );
            var secondLis = navSecond.find( '.menu-second-item' );
            secondLis.each(function(i) {
                //计算二级菜单项的宽度
                var secondAWidth = parseInt( $( this ).find( '.menu-second-item-a' ).outerWidth(true) );
                var navThirdWidth = parseInt( $( this ).find( '.menu-third' ).outerWidth( true ) );
								// TODO:test
								maxWidth = secondAWidth + maxThirdMenuWidth;

                navWidth = navThirdWidth ? (secondAWidth + navThirdWidth) : secondAWidth;
                if (navWidth > maxWidth) {
                    maxNavWidth = maxWidth;
                } else if (navWidth > maxNavWidth) {
                    maxNavWidth = navWidth;
                }

                // 计算二级菜单项的高度
                var thirdLis = $( this ).find( '.menu-third' );
                var lineCount = parseInt(thirdLis.length / lineItemsNumber);
                var addHeight = 0;
                if (lineCount == 0) {
                    totalHeight += 31;
                } else {
                    addHeight = (thirdLis.length % lineItemsNumber > 0) ? 31 : 0;
                    totalHeight += lineCount * 30 + lineCount + addHeight;
                }
                // var secondAHeight = $( this ).find( '.menu-second-item-a' ).outerHeight();
                // totalHeight += secondAHeight;
            });
            //设置二级菜单项的宽和高
            navSecond.css( 'width' , maxNavWidth );
            // navSecondBox.width( maxNavWidth );
            navSecond.css( 'height', totalHeight );

            //限制二级菜单的最大最小高度
            if (navSecond.css("height") && parseInt(navSecond.css("height")) < minBoxHeight) {
                navSecond.css("height", minBoxHeight);
                var lastA = navSecond.find(".menu-second-item-a").last();
                var lastLiHeight = lastA.height();
                lastA.height(lastLiHeight + minBoxHeight -totalHeight);
            } else if (navSecond.height() > maxBoxHeight) {
                navSecond.addClass("nav-second-over");
                navSecondBox.height(newBoxHeight);
                navSecondBox.addClass("box-overflow-hidden");
                navSecondBox.get(0).innerHTML += "<div class='button-up' ><span class='icon-arrow-up disabled'></span></div>" +
                    "<div class='button-down'><span class='icon-arrow-down'></span></div>";
                var btnUp = navSecondBox.find(".button-up"),
                    btnDown = navSecondBox.find(".button-down");
                btnDown.on("click", function(e) {
                    var btn = $(this);
                    var navSecond = btn.parent().children(".menu-second");
                    if (btn.children("span.disabled").length) {
                        return ;
                    }
                    var navSecondHeight = navSecond.outerHeight();
                    var navSecondTop = parseInt(navSecond.position().top);
                    var paddingTop = 29;
                    var topHeight = paddingTop - navSecondTop;
                    var boxHeight = 350;
                    var surplusHeight = navSecondHeight - topHeight - boxHeight;

                    //判断向上移动的距离
                    if (surplusHeight > boxHeight) {
                        navSecond.animate({top: (navSecondTop - boxHeight)}, "fast", function() {
                            btnUp.children("span").removeClass("disabled");
                        });
                    }else {
                        navSecond.animate({top: (navSecondTop - surplusHeight)}, "fast", function() {
                            //设定按钮状态
                            console.log(surplusHeight);
                            btn.children("span").addClass("disabled");
                            btnUp.children("span").removeClass("disabled");
                        });
                    }
                });
                btnUp.on("click", function(e) {
                    var btn = $(this);
                    var navSecond = btn.parent().children(".menu-second");
                    if (btn.children("span.disabled").length) {
                        return ;
                    }
                    var navSecondHeight = navSecond.outerHeight();
                    var navSecondTop = parseInt(navSecond.position().top);
                    var paddingTop = 29;
                    var topHeight = paddingTop - navSecondTop;
                    var boxHeight = 350;
                    if (topHeight > boxHeight) {
                        navSecond.animate({top: (navSecondTop + boxHeight)}, "fast", function() {
                            btnDown.children("span").removeClass("disabled");
                        });
                    } else {
                        navSecond.animate({top: paddingTop}, "fast", function() {
                            btnDown.children("span").removeClass("disabled");
                            btnUp.children("span").addClass("disabled");
                        });
                    }
                });
            }
            $(this).find(".menu-second-box").css("display", "none");
        });
	},
	/**
	* 初始化三级菜单
	*/
	_initMenuThird : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		g._fixMenuThirdHtml();	
		g._initThirdMenuWidth();
		g._initThirdMenuBorder();	
	},
	/**
	* 修正三级菜单结构
	*/
	_fixMenuThirdHtml : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var $menuSecond = el.parent().find( '.menu-second' );
		$menuSecond.each( function( i ) {
            //找到含有三级子菜单的菜单项
            if ( $( this ).find( ".menu-third" ).length > 0 ) {
                $( this ).find( ".menu-second-item" ).each( function( i ) {
                    var secondLi = $( this );
                    //找到不含三级子菜单的二级菜单
                    if (secondLi.find( ".menu-third" ).length == 0 ) {
                        this.innerHTML += "<ul class='menu-third'></ul>";
                    }
                });
            }
        });
	},
	/**
	* 初始化三级菜单宽度
	*/
	_initThirdMenuWidth : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var maxWidth, navWidth, itemWidth, lineCountLimit, maxTotalCount;
				// maxWidth = 465;
        maxWidth = 614;
				navWidth = 0;
        itemWidth = 150;
        lineCountLimit = 4;
        maxTotalCount = 0;

		el.parent().find( '.menu-second' ).each( function( i ) {
            var navThird = $( this ).find( ".menu-third" );
            navThird.each(function(i) {
                var liCount = $(this).children(".menu-third-item").length;
                if (liCount > lineCountLimit) {
                    maxTotalCount = lineCountLimit;
                } else {
                    if (liCount > maxTotalCount) {
                        maxTotalCount = liCount;
                    }
                }
            });
            navWidth = maxTotalCount * itemWidth;
            if (navWidth > maxWidth) {
                navWidth = maxWidth;
            }
            navThird.css("width", navWidth);
            navWidth = 0;
            maxTotalCount = 0;
        });
	},
	/**
	* 初始化三级菜单边框
	*/
	_initThirdMenuBorder : function() {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var lineItemsNumber = 4;
        el.parent().find( '.menu-third' ).each( function() {
            var menuItems = $( this ).find(".menu-third-item-a");
            var count = menuItems.length;
            if (count > lineItemsNumber ) {
                var lineCount = parseInt(count / lineItemsNumber);
                var surplusItems = count % lineItemsNumber;
                if (surplusItems == 0) {
                    lineCount--;
                }
                for(var j = 0; j < lineCount * lineItemsNumber; j ++) {
                    menuItems.eq(j).addClass("has-border");
                }
            }
        });
	},
	/**
	* resize事件处理函数
	*/
	_resize : function() {

	},
	/**
	* 确定二级菜单定位方式
	*/
	_setMenuSecondPosition : function( menuSecond ) {
		var g = this, p = g.options, el = g.element, dom = g.dom;
		var position = {}, menuWrapOffsetLeft, menuWrapWidth, $menuSecond,
			$primaryItem, dataIndex, primaryItemOffsetLeft, primaryItemWidth, primaryItemHeight, menuSecondWidth;

		$menuSecond = $( menuSecond );
		dataIndex = $menuSecond.attr( 'data-index' );
		$primaryItem = $( '.menu-primary-item-a[data-index=' + dataIndex + ']');

		menuWrapOffsetLeft = g.wrap.offset().left;
		menuWrapWidth = g.wrap.outerWidth();						

		primaryItemOffsetLeft = $primaryItem.offset().left;
		primaryItemWidth = $primaryItem.outerWidth();
		primaryItemHeight = $primaryItem.outerHeight();

		menuSecondWidth = $menuSecond.outerWidth();


		// 计算水平定位方式
		if ( primaryItemOffsetLeft + menuSecondWidth < menuWrapOffsetLeft + menuWrapWidth ) {
			position.left = primaryItemOffsetLeft - menuWrapOffsetLeft;
		} else if ( menuSecondWidth < primaryItemOffsetLeft - menuWrapOffsetLeft ) {
			position.right = menuWrapOffsetLeft + menuWrapWidth - primaryItemOffsetLeft - primaryItemWidth;
		} else {
			position.right = 0;
		}
		position.top = primaryItemHeight;
		return position;
	}

};