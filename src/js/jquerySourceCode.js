/*jquery的无new构建*/
// var aQuery = function(selector, context) {
// 	return new aQuery.prototype.init();
// }  

// aQuery.prototype = {
// 	init : function() {
// 		this.age = 18;
// 		return this;
// 	},
// 	name : function() {
// 		console.log(this.age);
// 		return this;
// 	},
// 	age : 20
// };
// aQuery.prototype.init.prototype = aQuery.prototype;
// aQuery();

$(function(){
	debugger;
	// var div = document.getElementById( 'container' );
	var $div = $( '#container' );
});

// 值传递
// var n = 1;
// var m = n;
// n = 2;
// function console1(){ console.log(1) }
// function console2(){ console.log(2) }
// var fun1 = console1;
// var fun2 = fun1;
// fun1 = console2;
// fun1();
// fun2();

// 引用传递
// var obj1 = { name: 'wang', age: 20 };
// var obj2 = obj1;
// obj1.age = 21;
// var arr1 = [1, 2];
// var arr2 = arr1;
// arr1.push(3);

/**
 * 测试对象的遍历
 * */
// 原型式
// function object(o) {
// 	function F() {}
// 	F.prototype = o;
// 	return new F();
// }
// 寄生式继承
// function inheritPrototype( subType, superType ) {
// 	var prototype = object( superType.prototype );
// 	prototype.constructor = subType;
// 	subType.prototype = prototype;
// }
// Object()方法测试
// var a = { name:'wang' };
// var b = Object(a);
// b.name = 'nan';


// 构造函数
// function Creature() {
// 	this.live = true;
// }
// Creature.prototype.pLevel = 'creature';
// function Animal() {
// 	Creature.apply( this );
// 	this.inLand = true;
// }
// inheritPrototype( Animal, Creature );
// Animal.prototype.move = function() {
// 	console.log( 'moving' );
// };
// Animal.prototype.pLevel = 'animal';
//
//
// var animal = new Animal();
//
// function Person() {
// 	Animal.apply( this );
// 	this.name = 'wang';
// 	this.age = 28;
// 	this.preference = {
// 		food: 'noodle',
// 		sport: 'run'
// 	};
// }
// inheritPrototype( Person, Animal );
// Person.prototype.pLevel = 'person';
//
// var person = new Person();
// debugger
// var clone = $.extend(true, {}, person);
// person.pLevel = 'newLevel';
// for ( var attr in person ) {
// 	if ( attr == 'preference' ) {
// 		var childObj = person[ attr ];
// 	}
// 	console.log( attr );
// }
// childObj.food = 'meat';
/*
*深度克隆扩展对象（与深度克隆复制对象略有区别）
*被扩展对象已经存在的属性会被覆盖
*/
//深度克隆扩展对象（与深度克隆复制对象略有区别）
// for (name in options) {
// 	src = target[name];
// 	copy = options[name];

// 	if (target === copy) {
// 		continue;
// 	}

// 	if ( deep & copy & ( jQuery.isPlainObject(copy) || ( copyIsArray = jQuery.isArray(copy) ) ) ) {
// 		if ( copyIsArray ) {
// 			copyIsArray = false;
// 			clone = src && jQuery.isArray(src) ? src : [];
// 		} else {
// 			clone = src && jQuery.isPlanObject(src) ? src : {};
// 		}

// 		target[ name ] = jQuery.extend( deep, clone, copy);
// 	} else if ( copy != undefined ) {
// 		target[ name ] = copy;
// 	}
// }

//测试jQuery.extend扩展的对象会不会有原型链上的方法和属性?
//原型链的属性和方法被扩展为对象自己的属性和方法
// target = {
// 	say : "haha",
// 	walk : ""
// };
//
// function Run() {
// 	this.active = "run";
// }
// Run.prototype = {
// 	doing : function() {
// 		console.log("running");
// 	}
// }
// copy = new Run();
// for ( name in copy ) {
// 	console.log(name);
// 	console.log(copy.hasOwnProperty(name));
// }
//copy.doing();
// $( function() {
// 	$.extend( true, target, copy );
// 	target.doing();
// 	console.log(target);
// } );

/*
*jQuery.fn.extend, attr
*/
// attr: function( name, value ) {
// 		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
// 	}

/*
*jQuery.extend, access
*/
// access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
// 		var i = 0,
// 			length = elems.length,
// 			bulk = key == null; 

// 		// Sets many values
// 		if ( jQuery.type( key ) === "object" ) {
// 			chainable = true;
// 			for ( i in key ) {
// 				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
// 			}

// 		// Sets one value
// 		} else if ( value !== undefined ) {
// 			chainable = true;

// 			if ( !jQuery.isFunction( value ) ) {
// 				raw = true;
// 			}

// 			if ( bulk ) {
// 				// Bulk operations run against the entire set
// 				if ( raw ) {
// 					fn.call( elems, value );
// 					fn = null;

// 				// ...except when executing function values
// 				} else {
// 					bulk = fn;
// 					fn = function( elem, key, value ) {
// 						return bulk.call( jQuery( elem ), value );
// 					};
// 				}
// 			}

// 			if ( fn ) {
// 				for ( ; i < length; i++ ) {
// 					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
// 				}
// 			}
// 		}

// 		return chainable ?
// 			elems :

// 			// Gets
// 			bulk ?
// 				fn.call( elems ) :
// 				length ? fn( elems[0], key ) : emptyGet;
// 	}

/*
*jQuery.extend, attr
*/
// attr: function( elem, name, value ) {
// 		var hooks, ret,
// 			nType = elem.nodeType;

// 		// don't get/set attributes on text, comment and attribute nodes
// 		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
// 			return;
// 		}

// 		// Fallback to prop when attributes are not supported
// 		if ( typeof elem.getAttribute === core_strundefined ) {
// 			return jQuery.prop( elem, name, value );
// 		}

// 		// All attributes are lowercase
// 		// Grab necessary hook if one is defined
// 		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
// 			name = name.toLowerCase();
// 			hooks = jQuery.attrHooks[ name ] ||
// 				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
// 		}

// 		if ( value !== undefined ) {

// 			if ( value === null ) {
// 				jQuery.removeAttr( elem, name );

// 			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
// 				return ret;

// 			} else {
// 				elem.setAttribute( name, value + "" );
// 				return value;
// 			}

// 		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
// 			return ret;

// 		} else {
// 			ret = jQuery.find.attr( elem, name );

// 			// Non-existent attributes return null, we normalize to undefined
// 			return ret == null ?
// 				undefined :
// 				ret;
// 		}
// 	}

/*
*jQuery的attr，prop，css，val方法
*
*/
// jQuery.fn.extend({
// 	attr: function( name, value ) {
// 		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
// 	},
//
// 	prop: function( name, value ) {
// 		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
// 	},
//
// 	val : function( value ) {
//
// 	},
// 	addClass: function( value ) {
// 		var classes, elem, cur, clazz, j,
// 			i = 0,
// 			len = this.length,
// 			proceed = typeof value === "string" && value;
//
// 			if ( jQuery.isFunction( value ) ) {
// 				return this.each(function( j ) {
// 					jQuery( this ).addClass( value.call( this, j, this.className ) );
// 				});
// 			}
//
// 			if ( proceed ) {
// 				classes = ( value || "" ).match( core_rnotwhite ) || [];
//
// 				for ( ; i < len; i++) {
// 					elem = this[ i ];
// 					cur = elem.nodeType ===1 && ( elem.className ?
// 						( " " + elem.className + " " ).replace( rclass, " " ) :
// 						" "
// 						);
// 				}
//
// 				if ( cur ) {
// 					j = 0;
// 					while ( (clazz = classes[j++]) ) {
// 						if ( cur.indexOf( " " + clazz + " ") < 0 ) {
// 							cur += clazz + " ";
// 						}
// 					}
// 					elem.className = jQuery.trim( cur );
//
// 				}
// 			}
//
// 			return this;
// 	}
// });

// 防止出现匿名代码段(chrome调试动态加载的脚本会出现VM文件)
//@ sourceURL=js/jquerySourceCode.js
//# sourceURL=js/jquerySourceCode.js
