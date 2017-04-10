/**
 * Created by wangc on 2017/4/10.
 * newMenu组件的测试文件
 */

// 引入expect
var expect = chai.expect;

//生成组件绑定的dom元素
var $menuContainer = $('<div id="menuContainer"></div>');
var $menuDom = $('<div id="menu"></div>');

$menuContainer.prepend($menuDom);
$('body').prepend($menuContainer);

var cMenu;
cMenu = new NewMenu($menuDom[0], {
  data : menuData.menus
});


describe('menu组件类存在', function() {
  it('NewMenu method is defined',function() {
    expect(NewMenu).to.exist;
  });
});

describe('menu组件实例化', function() {
  it('返回一个组件实例', function() {
    expect(cMenu).to.be.an.instanceof(NewMenu);
  });
});

describe('组件的几何属性', function() {
  it('设置一级菜单的高度', function() {
    expect(cMenu._setMenuHeight(35)).to.be.equal(35);
  });
});