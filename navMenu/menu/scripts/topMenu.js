/*$(function() {*/
	/**
	 * 四级菜单的顶级菜单
	 * @class Menu
	 * @params {dom} dom 菜单元素
	 * @params {options} options 菜单配置项
	 */
	function TopMenu( dom, options ) {
	 	this.dom = dom;
		this.element = $( dom );
	 	$.data( dom, 'topMenu', this );
	 	this.options = {
	 		//菜单宽度
	 		width : null,
	 		//菜单项的数据
	 		data : [],
	 		// 子菜单元素
	 		childMenuDom : null,
			// 子菜单的配置项
			childMenuOptions : null,
			// 是否采用异步数据
			isRemote: false,
	 		/**
	 		* 菜单项点击事件
	 		* @params {object} e jquery事件对象
	 		* @params {object} args args.sender是当前对象实例
	 		*/
	 		onItemClick : null
	 	};
	 	$.extend( this.options, options );
	 	this._create();
	}

	TopMenu.prototype = {
		constructor : TopMenu,
		/**
		* 创建组件
		*/
		_create : function() {
			this._render();
			this._init();
		},
		_render : function() {
			var g = this, p = this.options, dom = this.dom, elem = this.element;
			var data = p.data, menuStr;
			menuStr = g._buildMenuHtml( data );
			elem.html( menuStr ).addClass( 'topMenu' );
			elem.wrap( '<div class="topMenu-wrap"></div>' );
			g.wrap = elem.parent();
			g.wrap
				.append( '<a href="javascript:void(0);" class="topMenu-btn topMenu-btn-left"><span class="icon icon-arrow-left"></span></a>')
				.append( '<a href="javascript:void(0);" class="topMenu-btn topMenu-btn-right"><span class="icon icon-arrow-right"></span></a>');
			g.leftBtn = this.wrap.find( 'topMenu-btn-left' );
			g.rightBtn = this.wrap.find( 'topMenu-btn-right' );
		},
		_init : function() {
			var g = this, p = this.options, dom = this.dom, elem = this.element;

			g._initEvents();
			g._setMenuContentWidth();
			g._setBtnStaus();

			// 设置子菜单
			if ( p.childMenuDom ) {
				g.wrap.find( '.topMenu-item-a:first' ).addClass( 'active' );
				$.extend( p.childMenuOptions, { data : p.data[0].menu } )
				g.setChildMenu( p.childMenuDom, p.childMenuOptions );
			}	
		},
		/**
		* 构建菜单的html结构
		 * @params {Object} data 菜单数据
		*/
		_buildMenuHtml : function( data ) {
			var menuContent = '<ul class="topMenu-content">';
			$.each( data, function( index, menuItem ) {
				var iconClass, text, id, url;
				// 得到实际数据后便于进行修改
				iconClass = menuItem.iconClass || '';
				text = menuItem.text || '';
				id = menuItem.id || '';
				url = menuItem.url || '';

				menuContent += '<li class="topMenu-item"><a href="javascript:void(0);" class="topMenu-item-a" id="' + id 
							+ '" url="' + url +'" data-index="' + index + '"><span class="icon ' + iconClass + ' topMenu-item-icon"></span>'
							+ '<span class="topMenu-item-text">' + text + '</span></a></li>';
			} );
			menuContent += '</ul>';
			return menuContent;
		},
		/**
		* 初始化菜单的事件
		*/
		_initEvents : function() {
			var g = this, p = this.options, dom = this.dom, elem = this.element;

			//按钮事件
			g._initBtnEvents();

			//resize事件
			g._resize();

			//菜单项点击事件
			g.wrap.off( 'click.menuItem' );
			g.wrap.on( 'click.menuItem', '.topMenu-item', function( e, args ) {
				var $menuItem = $( this );
				var $menuItemA = $menuItem.find( 'a' );
				var url = $menuItemA.attr( 'url' );
				var dataIndex = $menuItemA.attr( 'data-index' );
				var childMenuData;
				var _args = {
					sender : g,
					dataIndex : dataIndex
				};
				
				if ( $menuItemA.hasClass( 'active' ) ) {
					//重复点击
					return false;
				} else {
					g.wrap.find( '.topMenu-item-a' ).removeClass( 'active' );
					$menuItemA.addClass( 'active' );

					// 重置子菜单
					if ( p.childMenuDom ) {
						childMenuData = p.data[ dataIndex ].menu;
						$.extend( p.childMenuOptions, { data : childMenuData } );
						g.setChildMenu( p.childMenuDom, p.childMenuOptions );
					}
					
					//执行自定义处理函数
					if ( p.onItemClick ) {
						p.onItemClick( e, _args );	
					}
					return false;
				}
			});
		},
		/**
		* 初始化按钮的事件
		*/
		_initBtnEvents : function() {
			var g = this, p = this.options, dom = this.dom, elem = this.element;
			//按钮点击事件
			g.wrap.off( 'click.menuBtn' );
			g.wrap.on( 'click.menuBtn', '.topMenu-btn', function( e, args ) {
				var $topMenu, $currentTarget, $menuContent,
					width, left, marginLeft;

				$currentTarget = $( e.currentTarget );
				$topMenu = elem;
				$menuContent = $topMenu.find( '.topMenu-content' );

				width = $topMenu.find( '.topMenu-item' ).outerWidth();
				left = $menuContent.offset().left - $topMenu.offset().left;
				marginLeft = parseInt( $menuContent.find( '.topMenu-item' ).css( 'marginLeft' ) );

				if ( !$currentTarget.hasClass( 'btn-disabled' ) ) {
					//按钮没有被禁用
					if ( $currentTarget.hasClass( 'topMenu-btn-left') ) {
						$menuContent.animate( {
							left : left + width + marginLeft * 2,
						}, 'fast', function() {
							//重新设置按钮状态
							g._setBtnStaus();
						} );	
					} else {
						$menuContent.animate( {
							left : left - width - marginLeft * 2,
						}, 'fast', function() {
							//重新设置按钮状态	
							g._setBtnStaus();	
						} );	
					}						
				}
			} )	;		
		},
		/**
		* 设置按钮状态
		*/ 
		_setBtnStaus : function() {
			var p = this.options, dom = this.dom, elem = this.element;
			var $topMenu, $menuContent,
				topMenuWidth, menuContentWidth;

			$topMenu = elem;		
			$menuContent = $topMenu.find( '.topMenu-content' );

			topMenuWidth = $topMenu.width();
			menuContentWidth = this.menuContentWidth;

			if ( menuContentWidth <= topMenuWidth && $menuContent.offset().left >= $topMenu.offset().left ) {
				//禁用按钮
				$( '.topMenu-btn' ).addClass( 'btn-disabled').removeClass( 'btn-active' );
			} else {
				$( '.topMenu-btn-left' ).addClass( 'btn-disabled' ).removeClass( 'btn-active' );
				$( '.topMenu-btn-right' ).addClass( 'btn-disabled' ).removeClass( 'btn-active' );

				if ( $menuContent.offset().left < $topMenu.offset().left ) {
					//左侧按钮可用
					$( '.topMenu-btn-left' ).removeClass( 'btn-disabled' ).addClass( 'btn-active' );
				}
				if ( $menuContent.offset().left + menuContentWidth > $topMenu.offset().left + topMenuWidth ) {
					//右侧按钮可用
					$( '.topMenu-btn-right' ).removeClass( 'btn-disabled' ).addClass( 'btn-active' );
				}
			}
		},
		/**
		* 计算菜单内容的总长度
		*/ 
		_setMenuContentWidth : function() {
			var p = this.options, dom = this.dom, elem = this.element;
			var menuItem, itemWidth, marginLeft, menuCount;

			menuCount = p.data.length;
			menuItem = $( '.topMenu-item' );
			itemWidth = menuItem.width();
			marginLeft = parseInt( menuItem.css( 'marginLeft' ) );
			
			// 计算菜单内容的总长度
			this.menuContentWidth = menuCount * ( itemWidth + marginLeft * 2 );	
			// 设置菜单内容的总长度
			elem.find( '.topMenu-content' ).width( this.menuContentWidth );
		},
		/**
		* resize事件处理
		*/ 
		_resize : function() {
			var g = this, p = this.options, dom = this.dom, elem = this.element;
			var timeout, startTime, currentTime, limitTime = 500;

			$( window ).resize( function() {

				currentTime = new Date();
				if ( startTime && currentTime.getTime() - startTime.getTime() >= limitTime ) {
					satrtTime = null;
					clearTimeout( timeout );
					//处理resize事件的代码
					if ( true ) {
						g._setBtnStaus();	
					}	
				} else {
					startTime = startTime || new Date();
					timeout && clearTimeout( timeout );
					timeout = setTimeout( function() {
						satrtTime = null;
						
						if ( true ) {
							g._setBtnStaus();	
						}
					}, 300);
				}	
			});
		},
		/**
		* 设置子菜单
		* @param {dom} childMenuDom 子菜单对应的dom节点
		* @param {Object} childOptions 子菜单的配置项
		*/ 
		/*setChildMenu : function( childMenuDom, data ) {
			var g = this, p = this.options, dom = this.dom, elem = this.element;

			//menus是假数据
			// TODO: 实际使用应该删除data赋值的语句
			// data = menus;

			//清除原有子菜单
			if ( g.childMenu ) {
				var ls = g.childMenu.wrap.replaceWith( '<div id="childMenu"></div>');
				childMenuDom = $( '#childMenu' )[0];
			}

			//设置子菜单
			g.childMenu = new NewMenu( childMenuDom, {
				data : data
			} );

		}*/
		setChildMenu : function( childMenuDom, childOptions ) {
			var g = this, p = this.options, dom = this.dom, elem = this.element;

			//清除原有子菜单
			if ( g.childMenu ) {
				var ls = g.childMenu.wrap.replaceWith( '<div id="childMenu"></div>');
				childMenuDom = $( '#childMenu' )[0];
			}

			//设置子菜单
			g.childMenu = new NewMenu( childMenuDom, childOptions );
		}
	};
/*});*/
