/**
 * 初始化右侧选项卡
 */
var selectTabTitle = '', selectId = '';
/**
 * 初始化页面
 */
$(function() {
	/**
	 * 顶部按钮初始化
	 */
	$(".btn-key").button({
				type : "button",
				iconCls : "icon-key"
			});
	$(".btn-notice").button({
				type : "button",
				iconCls : "icon-notice"
			});
	$(".btn-question").button({
				type : "button",
				iconCls : "icon-question"
			});
	$(".btn-invitation").button({
				type : "button",
				iconCls : "icon-zzadd-user"
			});
	$(".btn-power").button({
		type : "button",
		iconCls : "icon-power"
			// btnActiveCls : 'btn-active btn-danger'
		});
	$(".btn-changeTheme").button({
		type : "button",
		iconCls : "icon-clothes"
	});
	var initTopMenu = function() {
		$.ajax({
					type : 'post',
					url : 'permission/account/getMenuTopBarConfig.do',
					success : function(data) {
						data = eval("(" + data + ")");
						if (data.successful) {
							var menus = data.resultValue;
							for (var id in menus) {
								if (menus[id] == true) {
									$("#" + id).show();
								} else {
									$("#" + id).hide();
								}
							}
						}
					}
				});
	};
	initTopMenu();
	/**
	 * 邀请用户处理函数
	 */
	var invitationHander = function() {
		// 判断弹出框是否存在
		if (art.dialog.get('invitationPopBox') == undefined) {
			// 获取容器对象
			var content = $(".invitation-pop-box")[0];
			// 对话框
			var dialog = art.dialog({
				lock : true,
				id : 'passPopBox',
				title : '邀请用户',
				content : content,
				init : function() {
					$("#userMobilePhone").val('');
				},
				button : [{
					name : '邀请',
					callback : function() {
						// 获取手机号
						var phone = $("#userMobilePhone").val();
						// 正则校验函数
						var reg = /^1[3|4|5|7|8]\d{9}$/;
						if (!reg.test(phone)) {
							artDialog.alert("请输入正确的手机号码");
						} else {
							// 请求数据
							$.ajax({
										type : 'post',
										url : 'organization/invite/phoneInvite.do',
										data : {
											phoneNum : phone
										},
										success : function(data) {
											var obj = $.evalJSON(data);
											if (obj.successful) {
												artDialog.alert("发送成功",
														function() {
															$("#userMobilePhone")
																	.val('');
														});
											} else {
												artDialog.alert("发送邀请错误");
											}
										},
										error : function() {
											artDialog.alert("发送邀请错误");
										}
									});
						}
						return false;
					}
				}, {
					name : '取消'
				}]
			});
		} else {
			// 清空输入框
			$("#userMobilePhone").val('');
			// 弹出组件
			art.dialog.get('invitationPopBox').show();
		}
	}
	// 点击邀请用户
	$(".btn-invitation").on("click", function(e) {
				// 阻断事件
				e.preventDefault();
				// 调用邀请方法
				invitationHander();
			});
	//点击显示换肤列表
	$("#btn-changeTheme").on("click",function(e){
		e.preventDefault();
		//显示换肤对话框
		showThemes();
	});
	/**
	 *显示换肤选项提示框	
	 */
	function showThemes() {
		if( art.dialog.get( "themePopBox" ) == undefined ) {
			var popBoxHtml = $( ".theme-pop-box" )[0];
			var currentTheme = themeColor;
			$( ".theme-box" ).combofield({
				id : "themeBox",
				label : "颜色主题",
				value : currentTheme,
				data : [{
					id : "blue",
					text : "蓝色",
				}, {
					id : "dark",
					text : "深色"
				}, {
					id : "bootstrap",
					text : "bootstrap"
				}, {
					id : "common",
					text : "common"
				}, {
					id : "powergreen",
					text : "国网绿"
				}]
			});
			art.dialog({
				id : "themePopBox",
				title : "选择新的颜色主题",
				content : popBoxHtml,
				lock : true,
				button : [{
					name : "确定",
					callback : function() {
						var oldTheme = themeColor;
						var newTheme = $( ".theme-box" ).combofield( "getValue" );
						changeColorHander( oldTheme, newTheme );
					}
				}, {
					name : "取消",
					callback : function() {

					}
				}]
			});
		} else {
			art.dialog.get( "themePopBox" ).show();
		}
		
	}

	/**
	 * 换肤处理函数
	 */
	var changeColorHander = function(oldTheme,newTheme){
		if ( newTheme == oldTheme ) {
			return;
		}
		var reg = new RegExp(oldTheme,"g");

		//修改当前所在页面的主题
		$( "link" ).each( function( index, link ) {
			if ( link.href.indexOf( oldTheme ) >= 0 ) {
				var newLinkHref = link.href.replace( reg, newTheme );
				link.href = newLinkHref;
			}
		});

		//修改页面中iframe的主题
		var iframes = $( "iframe" );
		iframes.each( function( index, iframe ) {
			var iframeWindow = iframe.contentWindow;
			iframeLinks = iframeWindow.document.getElementsByTagName("link");
			$.each( iframeLinks, function( index, link ) {
				if ( link.href.indexOf( oldTheme ) >= 0 ) {
					var newLinkHref = link.href.replace( reg, newTheme );
					link.href = newLinkHref;
				}
			});
		});

		//修改cookie中存储的颜色主题
		var cookieName, cookieStatr, cookieValue, cookieEnd,
			path, expires;
		expires =  new Date();
		expires.setYear( expires.getFullYear() + 3 );	
		//设置新的cookie值
		cookieName = encodeURIComponent( "themeColor" );
		cookieValue = encodeURIComponent( newTheme );
		document.cookie = cookieName + "=" + cookieValue + "; path=/plat" + "; expires=" + expires;
		themeColor = newTheme;
	}

	
	/**
	 * 更新顶部信息
	 */
	function topHander() {
		$(".username").html(user_name);
		// var span = $("<span class='notice-mark'></span>");
		// $(".btn-notice span.icon").append(span);
		$.ajax({
					type : "post",
					url : "msg/message/unread.do",
					data : {
						"persId" : persId
					},
					dataType : "json",
					success : function(data) {
						var success = data.successful;
						var messageCount = success ? data.resultHint : 0;
						// 显示消息数量或新消息图标提示
						if (messageCount > 0) {
							var span = $("<span class='notice-mark'></span>");
							$(".btn-notice span.icon").append(span);
						} else {
							$(".btn-notice .notice-mark").remove();
						}
					},
					error : function(err) {

					}
				});
	}
	topHander();
	/**
	 * 通知按钮
	 */
	$(".btn-notice").on("click", function(e) {
				// 阻断事件
				e.preventDefault();
				// 增加消息管理器
				$(".top-tabs").menuTabs("addTab", {
							title : "消息管理器",
							url : "msg/jquery/system_msg.jsp",
							closable : true
						});
			});
	/**
	 * 退出按钮
	 */
	function logout() {
		art.dialog({
					id : "logoutPop",
					content : "你确定要退出管理平台么",
					button : [{
						name : "确定",
						callback : function() {
							$.ajax({
										type : "post",
										url : "permission/account/logoff.do",
										data : {
											agent : "0"
										},
										success : function(response) {
											var data = eval("(" + response
													+ ")");
											data.successful
													? window.location.href = webAppPath
															+ data.resultValue.url
													: '';
										},
										error : function(err) {
											art.dialog({
														id : "artError",
														title : "错误提示",
														icon : "error",
														time : 2,
														content : "退出失败"
													});
										}
									});
							return false;
						},
						focus : true
					}, {
						name : "取消",
						cancel : true,
						callback : function() {
						}
					}]
				});
	}
	$(".btn-power").on("click", function(e) {
				e.preventDefault();
				logout();
			});

	/**
	 * 修改密码功能
	 */
	function passHander(logo_id, logo_name) {
		if (art.dialog.get("passPopBox") == undefined) {
			var popBoxHtml = $(".pass-pop-box")[0];
			var dialog = art.dialog({
				id : "passPopBox",
				title : "修改密码",
				lock : true,
				content : popBoxHtml,
				init : function() {
					$("#userName").attr({
								"value" : logo_name,
								"logo_id" : $("#logo_id").val()
							});
				},
				button : [{
					name : "确定",
					callback : function() {
						var oldPass = $("#oldPass"), newPass = $("#newPass"), reNewPass = $("#reNewPass"), oldPassVal = $
								.trim(oldPass.val()), newPassVal = $
								.trim(newPass.val()), reNewPassVal = $
								.trim(reNewPass.val());
						newPass.next(".info").html("");
						reNewPass.next(".info").html("");

						if (reNewPassVal != newPassVal) {
							art.dialog({
										id : "artErrorkk",
										title : "错误提示",
										icon : "error",
										time : 2,
										content : "两次输入的密码不一致"
									});
							return false;
						}

						$.ajax({
							type : "post",
							url : "permission/account/modify.do",
							data : {
								logo_id : logo_name,
								oldPass : CryptoJS.MD5(oldPassVal).toString(),
								newPass : newPassVal
							},
							success : function(data) {
								var data = eval("(" + data + ")"), resultHint = data.resultHint;
								if (data.successful) {
									art.dialog({
												id : "artSuccess",
												title : "恭喜您",
												icon : "success",
												time : 2,
												content : resultHint
											});
									dialog.close();
								} else {
									art.dialog({
												id : "artError",
												title : "错误提示",
												icon : "error",
												time : 2,
												content : resultHint
											});
								}
							},
							error : function(err) {
								art.dialog({
											id : "artError",
											title : "错误提示",
											icon : "error",
											time : 2,
											content : "修改密码失败"
										});
							}
						});
						return false;
					},
					focus : true
				}]
			});
		} else {
			$("#oldPass").val('');
			$("#newPass").val('');
			$("#reNewPass").val('');
			art.dialog.get("passPopBox").show();
		}
	}
	$(".btn-key").on("click", function() {
				var logo_id = loginId;
				var logo_name = user_name;
				passHander(logo_id, logo_name);
			});
	/**
	 * 顶部导航菜单初始化
	 */
	/**
	 * 创建菜单html结构
	 */
	function createMenuHtml(menus) {
		var menuStr = "";
		menus.forEach(function(item) {
			menuStr += "<li class='primary-li top-menu-li'>";
			// 判断a标签是否能添加tabs页签
			if (item.url != null) {
				// 设置URL
				var _url = item.url;
				if ((_url || '').indexOf("?") != -1) {
					_url = _url + "&MenuID=" + item.id;
				} else {
					_url = _url + "?MenuID=" + item.id;
				}
				// 生成菜单
				menuStr += "<a class='primary-a' href='" + _url + "' id='"
						+ item.id + "'>" + item.text + "</a>";
			} else {
				menuStr += "<a class='primary-a' id='" + item.id + "'>"
						+ item.text + "</a>"
			}
			// 添加二级子菜单
			if (item.menu != null) {
				menuStr += "<div class='nav-second-box'>"
						+ "<ul class='nav-second'>";
				item.menu.forEach(function(secondItem) {
					menuStr += "<li class='second-li clx'>";
					if (secondItem.url != null) {
						var _url2 = secondItem.url;
						if ((_url2 || '').indexOf("?") != -1) {
							_url2 = _url2 + "&MenuID=" + secondItem.id;
						} else {
							_url2 = _url2 + "?MenuID=" + secondItem.id;
						}
						menuStr += "<a class='second-a end-nav-item' href='"
								+ _url2 + "' id='" + secondItem.id + "'>"
								+ secondItem.text + "</a>";
					} else {
						menuStr += "<a class='second-a' id='" + secondItem.id
								+ "'>" + secondItem.text + "</a>";
					}
					// 添加三级子菜单
					if (secondItem.menu != null) {
						menuStr += "<ul class='nav-third'>";
						secondItem.menu.forEach(function(thirdItem) {
							menuStr += "<li class='third-li'>";
							if (thirdItem.url != null) {
								// 设置URL
								var _url3 = thirdItem.url;
								if ((_url3 || '').indexOf("?") != -1) {
									_url3 = _url3 + "&MenuID=" + thirdItem.id;
								} else {
									_url3 = _url3 + "?MenuID=" + thirdItem.id;
								}
								menuStr += "<a class='third-a end-nav-item' href='"
										+ _url3
										+ "' id='"
										+ thirdItem.id
										+ "'>" + thirdItem.text + "</a>";
							} else {
								menuStr += "<a class='third-a' id='"
										+ thirdItem.id + "'>" + thirdItem.text
										+ "</a>";
							}
							menuStr += "</li>";
						});
						menuStr += "</ul>";
					}
					menuStr += "</li>";
				});
				menuStr += "</ul></div>";
			}
			menuStr += "</li>";
		});
		return menuStr;
	}
	/**
	 * 获取菜单数据
	 */
	function getUserMenu() {
		$.ajax({
					type : "post",
					url : basePath + 'permission/account/getUserMenu.do',
					success : function(data) {
						var data = data.replace(/menuItemClick/g, '""')
								.replace(/null/g, '""');
						data = eval("(" + data + ")");
						// 生成数据对应的html结构，并加入文档
						var menuHtmlStr = createMenuHtml(data.menus);
						$(".nav-primary-box").html(menuHtmlStr);
						// 调整样式
						$(document.body).find('.top-menu-li').css({
									'font-size' : '14px',
									'font-weight' : 'bold'
								})
						// 初始化菜单的样式和功能
						initNavMenu();
						initTabs(data.firstPage);
					},
					error : function(err) {

					}
				})
	}
	/**
	 * 初始化三级菜单
	 */
	function initThirdMenuWidth() {
		$(".primary-li").each(function(i) {
					var maxWidth = 460;
					var navWidth = 0;
					var itemWidth = 111;
					var lineCountLimit = 4;
					var maxTotalCount = 0;
					var navThird = $(this).find(".nav-third");
					navThird.each(function(i) {
								var liCount = $(this).children(".third-li").length;
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
				})
	}
	function initThirdMenuHeight() {
		$(".primary-li").each(function(i) {
			// 找到含有三级子菜单的菜单项
			if ($(this).find(".nav-third").length > 0) {
				$(this).find(".second-li").each(function(i) {
							var secondLi = $(this);
							// 找到不含三级子菜单的二级菜单
							if (secondLi.find(".nav-third").length == 0) {
								this.innerHTML += "<ul class='nav-third'></ul>";
							}
						});
			}
		});
	}
	function initThirdMenuBorder() {
		var lineItemsNumber = 4;
		$(".nav-third").each(function() {
					var menuItems = $(this).find(".third-a");
					var count = menuItems.length;
					if (count > lineItemsNumber) {
						var lineCount = parseInt(count / lineItemsNumber);
						var surplusItems = count % lineItemsNumber;
						if (surplusItems == 0) {
							lineCount--;
						}
						for (var j = 0; j < lineCount * lineItemsNumber; j++) {
							menuItems.eq(j).addClass("has-border");
						}
					}
				});
	}
	/**
	 * 设置二级导航项的宽度和高度
	 */
	function setNavSecondItemsSize() {
		var paddingRight = 10;
		var marginLeft = 13;
		var borderWidth = 1;
		var primaryLis = $(".primary-li");
		primaryLis.each(function(i) {
			var _i = i;
			var navSecondItems = $(this).find(".second-a");
			var primaryLiWidth = $(this).outerWidth(true);
			var secondItemWidth = 0;
			var maxSecondItemWidth = 0;
			navSecondItems.each(function(j) {
						var _j = j;
						secondItemWidth = $(this).outerWidth(true);
						if (secondItemWidth > maxSecondItemWidth) {
							maxSecondItemWidth = secondItemWidth;
						}
						// 设置高度
						var navThirdHeight = parseInt($(this).parent()
								.find(".nav-third").height());
						$(this).height(navThirdHeight);
					});
			// 如果二级菜单宽度小于对应的一级菜单，宽度设为和一级菜单一致
			if (maxSecondItemWidth < primaryLiWidth) {
				maxSecondItemWidth = primaryLiWidth;
				navSecondItems.each(function() {
							$(this).width(maxSecondItemWidth - marginLeft
									- borderWidth * 2);
						});
			} else {
				navSecondItems.each(function() {
					$(this)
							.width(maxSecondItemWidth /*- marginLeft - borderWidth * 2*/);
					$(this).css("padding-right", paddingRight);
				});
			}

		});
	}
	/**
	 * 设置所有二级菜单的宽和高
	 */
	function setNavSecondBoxSize() {
		setNavSecondItemsSize();
		var maxWidth = 595;
		var bodyWidth = $("body").outerWidth(true);
		var minBoxHeight = 108;
		var maxBoxHeight = 382;
		var newBoxHeight = 379;
		var maxSecondNavHeight = 343;
		var lineItemsNumber = 4;
		$(".primary-li").each(function(i) {
			var primaryLi = $(this);
			var navWidth = 0;
			var maxNavWidth = 0;
			var totalHeight = 10;
			var _i = i;
			var navSecondBox = $(this).find(".nav-second-box");
			var navSecond = $(this).find(".nav-second");
			var secondLis = navSecond.find(".second-li");
			secondLis.each(function(i) {
						// 计算二级菜单项的宽度
						var secondAWidth = parseInt(secondLis.find(".second-a")
								.outerWidth(true));
						var navThirdWidth = parseInt($(this).find(".nav-third")
								.outerWidth(true));
						navWidth = navThirdWidth
								? (secondAWidth + navThirdWidth)
								: secondAWidth;
						if (navWidth > maxWidth) {
							maxNavWidth = maxWidth;
						} else if (navWidth > maxNavWidth) {
							maxNavWidth = navWidth;
						}
						// 计算二级菜单项的高度
						var thirdLis = $(this).find(".third-li");
						var lineCount = parseInt(thirdLis.length
								/ lineItemsNumber);
						var addHeight = 0;
						if (lineCount == 0) {
							totalHeight += 31;
						} else {
							addHeight = (thirdLis.length % lineItemsNumber > 0)
									? 31
									: 0;
							totalHeight += lineCount * 30 + lineCount
									+ addHeight;
						}
					});
			// 设置二级菜单项的宽和高
			navSecond.css("width", maxNavWidth);
			navSecondBox.width(maxNavWidth);
			navSecond.css("height", totalHeight);
			// 限制二级菜单的最大最小高度
			if (navSecond.css("height")
					&& parseInt(navSecond.css("height")) < minBoxHeight) {
				navSecond.css("height", minBoxHeight);
				var lastA = navSecond.find(".second-a").last();
				var lastLiHeight = lastA.height();
				lastA.height(lastLiHeight + minBoxHeight - totalHeight);
			} else if (navSecond.height() > maxBoxHeight) {
				navSecond.addClass("nav-second-over");
				navSecondBox.height(newBoxHeight);
				navSecondBox.addClass("box-overflow-hidden");
				navSecondBox.get(0).innerHTML += "<div class='button-up' ><span class='icon-arrow-up disabled'></span></div>"
						+ "<div class='button-down'><span class='icon-arrow-down'></span></div>";
				var btnUp = navSecondBox.find(".button-up"), btnDown = navSecondBox
						.find(".button-down");
				btnDown.on("click", function(e) {
					var btn = $(this);
					var navSecond = btn.parent().children(".nav-second");
					if (btn.children("span.disabled").length) {
						return;
					}
					var navSecondHeight = navSecond.outerHeight();
					var navSecondTop = parseInt(navSecond.position().top);
					var paddingTop = 29;
					var topHeight = paddingTop - navSecondTop;
					var boxHeight = 350;
					var surplusHeight = navSecondHeight - topHeight - boxHeight;

					// 判断向上移动的距离
					if (surplusHeight > boxHeight) {
						navSecond.animate({
									top : (navSecondTop - boxHeight)
								}, "fast", function() {
									btnUp.children("span")
											.removeClass("disabled");
								});
					} else {
						navSecond.animate({
									top : (navSecondTop - surplusHeight)
								}, "fast", function() {
									// 设定按钮状态
									console.log(surplusHeight);
									btn.children("span").addClass("disabled");
									btnUp.children("span")
											.removeClass("disabled");
								});
					}
				});
				btnUp.on("click", function(e) {
					var btn = $(this);
					var navSecond = btn.parent().children(".nav-second");
					if (btn.children("span.disabled").length) {
						return;
					}
					var navSecondHeight = navSecond.outerHeight();
					var navSecondTop = parseInt(navSecond.position().top);
					var paddingTop = 29;
					var topHeight = paddingTop - navSecondTop;
					var boxHeight = 350;
					if (topHeight > boxHeight) {
						navSecond.animate({
									top : (navSecondTop + boxHeight)
								}, "fast", function() {
									btnDown.children("span")
											.removeClass("disabled");
								});
					} else {
						navSecond.animate({
									top : paddingTop
								}, "fast", function() {
									btnDown.children("span")
											.removeClass("disabled");
									btnUp.children("span").addClass("disabled");
								});
					}
				});
			}
			$(this).find(".nav-second-box").css("display", "none");
		});
	}
	/**
	 * 设置二级导航菜单的定位方式
	 */
	function setNavSecondBoxPosition() {
		var primaryLis = $(".primary-li.show-item");
		primaryLis.each(function(i) {
			var primaryLi = $(this);
			var navSecondBox = primaryLi.find(".nav-second-box");
			var bodyWidth = $("body").outerWidth(true);
			var left = primaryLi.offset().left;
			var primaryLiWidth = primaryLi.outerWidth(true);
			var navSecondBoxWidth = navSecondBox.outerWidth(true);
			if (left + navSecondBoxWidth > bodyWidth) {
				if (left + primaryLiWidth > navSecondBoxWidth) {
					// 右定位
					var style = $(this).find(".nav-second-box").attr("style");
					if (style) {
						var newStyle = style.replace(/left.*;/, "");
						$(this).find(".nav-second-box").attr("style", newStyle);
						$(this).find(".nav-second-box")
								.removeClass("position-left")
								.addClass("position-right");
					}
				} else {
					// 计算位置使二级导航全部显示
					var surplusWidth = 100;
					var moveDistance = -(left + navSecondBoxWidth - bodyWidth + surplusWidth);
					$(this).find(".nav-second-box")
							.removeClass("position-left")
							.removeClass("position-right");
					$(this).find(".nav-second-box").css("left", moveDistance);
				}
			} else {
				// 左定位
				var style = $(this).find(".nav-second-box").attr("style");
				if (style) {
					var newStyle = style.replace(/left.*;/, "");
					$(this).find(".nav-second-box").attr("style", newStyle);
					$(this).find(".nav-second-box")
							.removeClass("position-right")
							.addClass("position-left");
				}
			}
			$(this).find(".nav-second-box").css("display", "none");
		});
	}
	/**
	 * 初始化二级菜单
	 */
	function initSecondMenu() {
		// 初始化三级菜单
		initThirdMenuHeight();
		initThirdMenuWidth();
		initThirdMenuBorder();

		setNavSecondBoxSize();
	}
	/**
	 * 设置一级菜单的宽度
	 */
	function setNavPrimaryBoxWidth() {
		var navPrimaryBox = $(".nav-primary-box");
		var navMenuWidth = $(document.body).width();
		var btnWidth = $(".btn-left").outerWidth(true);
		var navPrimaryBoxWidth = navMenuWidth - btnWidth * 2 - 24;
		navPrimaryBox.width(navPrimaryBoxWidth);
	}
	/**
	 * 设置一级导航菜单的显示宽度,一级显示项的变化
	 */
	function setNavPrimaryShow() {
		setNavPrimaryBoxWidth();
		var navPrimaryBox = $(".nav-primary-box");
		var navPrimaryBoxWidth = navPrimaryBox.outerWidth(true);
		var showItems = $(".primary-li.show-item");
		var showItemsWidth = 0;
		var changeItemsCount = 0;
		showItems.each(function() {
					showItemsWidth += $(this).outerWidth(true);
				});
		// 导航菜单缩小，隐藏超出项;变大，增加新的导航项
		if (showItemsWidth > navPrimaryBoxWidth) {
			var sumWidth = 0;
			showItems.each(function(i) {
						sumWidth += $(this).outerWidth(true);
						if (sumWidth > navPrimaryBoxWidth) {
							$(this).removeClass("show-item")
									.addClass("after-show");
							$(".btn-right").removeClass("disabled").show();
						}
					});
		} else if (showItemsWidth < navPrimaryBoxWidth) {
			var afterShowItems = $(".after-show");
			var sumWidth = showItemsWidth;
			afterShowItems.each(function(i) {
						sumWidth += $(this).outerWidth(true);
						if (sumWidth <= navPrimaryBoxWidth) {
							$(this).removeClass("after-show")
									.addClass("show-item");
						} else {
							return false;
						}
					});
		}
		// 设置当前显示项的二级菜单定位方式
		setNavSecondBoxPosition();
	}
	/**
	 * 初始化一级菜单的显示项
	 */
	function initNavPrimaryShow() {
		setNavPrimaryBoxWidth();
		var navPrimaryBoxWidth = $(".nav-primary-box").outerWidth(true);
		var primaryItems = $(".primary-li");
		var itemsWidth = 0;
		primaryItems.each(function() {
					itemsWidth += $(this).outerWidth(true);
					if (itemsWidth <= navPrimaryBoxWidth) {
						$(this).removeClass("before-show after-show")
								.addClass("show-item");
					} else {
						$(this).removeClass("before-show show-item")
								.addClass("after-show");
					}
				});
		// 设置当前显示项的二级菜单定位方式
		setNavSecondBoxPosition();
	}
	/**
	 * 初始化按钮状态
	 */
	function initBtn() {
		var navPrimaryBoxWidth = $(".nav-primary-box").outerWidth(true);
		var totalPrimaryItems = $(".primary-li");
		var totalWidth = 0;
		totalPrimaryItems.each(function() {
					totalWidth += $(this).outerWidth(true);
				});
		$(".btn-left").addClass("disabled").hide();
		if (totalWidth > navPrimaryBoxWidth) {
			$(".btn-right").removeClass("disabled").show();
		} else {
			$(".btn-right").addClass("disabled").hide();
		}
	}
	/**
	 * 初始化导航菜单
	 */
	function initNavMenu() {
		initSecondMenu();
		// initEndNavItem();
		initNavPrimaryShow();
		initBtn();
		// 一级导航菜单的点击事件处理
		var itemClicked = null;
		$(".primary-li").on("click", function(e) {
					if (this != itemClicked) {
						$(".primary-li .nav-second-box").css("display", "none");
						$(this).find(".nav-second-box").css("display", "block");
						$(".primary-li .primary-a").removeClass("active");
						$(this).children(".primary-a").addClass("active");
						itemClicked = this;
					} else {
						$(this).find(".nav-second-box").css("display", "none");
						$(this).children(".primary-a").removeClass("active");
						itemClicked = null;
					}
				});
		$("body").on("click", function(e) {
					var i = $(e.target).parents(".primary-li")
							.index(".primary-li");
					if (i == -1) {
						$(".primary-li .nav-second-box").css("display", "none");
						$(".primary-li .primary-a").removeClass("active");
					}
				});
		// 菜单滑动按钮的点击事件处理
		$(".btn-right", $("#nav-menu")).on("click", function(e) {
			if (this.className.search("disabled") != -1) {
				return;
			}
			var btn = $(this);
			var navMenu = $("#nav-menu");
			var navPrimaryBox = $(".nav-primary-box");
			var afterShowItems = $("#nav-menu .after-show");
			var showItems = $("#nav-menu .show-item");
			var navPrimaryBoxWidth = navPrimaryBox.outerWidth(true);
			var afterShowWidth = 0;
			var startLeft = parseInt($(".btn-left").outerWidth(true));
			// 滑动过程
			navMenu.css("overflow", "hidden");
			navPrimaryBox.width(navPrimaryBoxWidth * 2);
			afterShowItems.each(function() {
						afterShowWidth += $(this).outerWidth(true);
						if (afterShowWidth <= navPrimaryBoxWidth) {
							$(this).removeClass("after-show")
									.addClass("show-item");
						}
					});
			navPrimaryBox.animate({
						left : (startLeft - navPrimaryBoxWidth)
					}, "fast", function() {
						showItems.removeClass("show-item")
								.addClass("before-show");
						navPrimaryBox.width(navPrimaryBoxWidth);
						navPrimaryBox.css("left", startLeft);
						navMenu.css("overflow", "visible");
						setNavSecondBoxPosition();
						if (afterShowWidth <= navPrimaryBoxWidth) {
							btn.addClass("disabled").hide();
						}
						$(".btn-left").removeClass("disabled").show();
					});
		});
		$(".btn-left", "#nav-menu").on("click", function() {
			if (this.className.search("disabled") != -1) {
				return;
			}
			var btn = $(this);
			var navMenu = $("#nav-menu");
			var navPrimaryBox = $(".nav-primary-box");
			var beforeShowItems = $("#nav-menu .before-show");
			var showItems = $("#nav-menu .show-item");
			var addShowItems = null;
			var navPrimaryBoxWidth = navPrimaryBox.outerWidth(true);
			var beforeShowWidth = 0;
			var startLeft = parseInt($(".btn-left").outerWidth(true));
			// 滑动过程
			navMenu.css("overflow", "hidden");
			navPrimaryBox.width(navPrimaryBoxWidth * 2);
			for (var j = beforeShowItems.length; j >= 0; j--) {
				beforeShowWidth += beforeShowItems.eq(j).outerWidth(true);
				if (beforeShowWidth <= navPrimaryBoxWidth) {
					beforeShowItems.eq(j).removeClass("before-show")
							.addClass("show-item");
				}
			}
			navPrimaryBox.css("left", startLeft - navPrimaryBoxWidth);
			navPrimaryBox.animate({
						left : (startLeft)
					}, "fast", function() {
						showItems.removeClass("show-item")
								.addClass("after-show");
						// 回到起始导航显示项时,补足不够的显示项
						if (beforeShowWidth < navPrimaryBoxWidth) {
							addItems = $(".primary-li.after-show");
							var addItemsWidth = 0;
							addItems.each(function() {
								addItemsWidth += $(this).outerWidth(true);
								if (beforeShowWidth + addItemsWidth <= navPrimaryBoxWidth) {
									$(this).removeClass("after-show")
											.addClass("show-item");
								} else {
									return false;
								}
							});
						}
						navPrimaryBox.width(navPrimaryBoxWidth);
						navMenu.css("overflow", "visible");
						setNavSecondBoxPosition();
						if (beforeShowWidth <= navPrimaryBoxWidth) {
							btn.addClass("disabled").hide();
						}
						$(".btn-right").removeClass("disabled").show();
					});
		});
		// 点击菜单选项增加新的tabs标签
		$(".nav-primary-box a").on("click", function(e) {
			e.preventDefault();
			var item = $(this);
			// 点击叶子导航项时添加tab标签
			if (item.attr("href") != null) {
				var text = item.html(), id = item.attr("id"), href = item
						.attr("href");
				$(".top-tabs").menuTabs("addTab", {
							title : text,
							id : id,
							url : href,
							selected : true,
							closable : true
						});
				item.parents(".nav-second-box").css("display", "none");
				item.parents(".primary-li").children(".primary-a")
						.removeClass("active");
				e.stopPropagation();
			}
		});
	}
	/**
	 * 初始化选项卡
	 */
	function initTabs(firstPage) {
		var imageMenuData = [{
					id : "900",
					text : "关闭其他"
				}, {
					id : "901",
					text : "关闭所有"
				}, "-", {
					id : "902",
					text : "刷新"
				}];

		var contentMenu = new $.f1.menu({
					name : "popMenu",
					data : imageMenuData,
					onMenuClick : function(sender, args) {
						var id = args.id;
						if (id == "900") {
							$('.top-tabs').menuTabs("closeOther", selectId);
						} else if (id == "901") {
							$('.top-tabs').menuTabs("closeAll");
						} else if (id == "902") {
							$('.top-tabs').menuTabs("refreshTab", selectId);
						}

					}
				});
		// 初始化选项卡
		$(".top-tabs").menuTabs({
					onContextMenu : function(e, args) {
						selectTabTitle = args.title;
						selectId = args.id;
						e.preventDefault();
						contentMenu.show({
									left : e.pageX,
									top : e.pageY
								});
					}
				});
		// 首页
		firstPage.forEach(function(item) {
					$(".top-tabs").menuTabs("addTab", {
								title : item.text,
								id : item.id,
								url : item.url,
								selected : true,
								closable : true
							});
				});
	}
	/**
	 * 顶部折叠按钮
	 */
	$(".header-roll").on("click", function(e) {
				var header = $(".header");
				var navMenu = $("#nav-menu");
				var btn = $(this);
				var headerHeight = 104;
				var navMenuHeight = navMenu.outerHeight(true);
				var classNames = ["icon-arrow-up-circle",
						"icon-arrow-down-circle"];
				// 更改顶部及按钮的状态
				if (btn.attr("class").search(classNames[0]) >= 0) {
					btn.removeClass(classNames[0]).addClass(classNames[1]);
					// 顶部收起
					header.height(navMenuHeight);
					header.children().css("display", "none");
					navMenu.css("display", "block");
					btn.css("display", "block");
					var nor = $("body").layout("panel", "north");
					var cent = $("body").layout("panel", "center");
					var option = {
						top : 0,
						height : $(window).outerHeight()
					}
					cent.panel("resize", option);
					nor.panel("option", "height", 0);
					nor.panel("open");
					var option = {
						height : 0
					}
					nor.panel("resize", option);
				} else {
					btn.removeClass(classNames[1]).addClass(classNames[0]);
					// 顶部全部显示
					header.height(headerHeight);
					header.children().css("display", "block");
					var nor = $("body").layout("panel", "north");
					var cent = $("body").layout("panel", "center");
					var option = {
						top : 55,
						height : $(window).outerHeight() - 55
					}
					cent.panel("resize", option);
					nor.panel("option", "height", 55);

					nor.panel("open");
					var option = {
						height : 55
					}
					nor.panel("resize", option);
				}
			});
	getUserMenu();
	window.onresize = function(e, args) {
		setNavPrimaryShow();
	};
});
