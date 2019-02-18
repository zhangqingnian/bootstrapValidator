var I18N = (function(root,factory){
	//通过闭包，调用工厂类方法，最终返回我们I18N插件的实例
	return factory.call(root);
})(this,function(root){
	var __PROTO__ = {};//所有插件国际化内容的缓存区
	//国际化插件 工作的架构原型
	var __I18N__ = {
		EN : "en",
		ZH : "zh",
		KO : "ko",
		JA : "ja",
		//...
		//安装插件
		install : function(obj,name){
			for(var prop in this){
				obj[prop] = this[prop];
			}
			obj.__name = name;//源对象赋予了插件名字
			__PROTO__[name] = __PROTO__[name] || {};//插件 name 的国际化缓存区域
		},
		language : function(lang,obj,name){
			name = name || this.__name;
			__PROTO__[name] = __PROTO__[name] || {};
			__PROTO__[name][lang] = obj;
		},
		getMessage : function(lang,key){
			return __PROTO__[this.__name][lang][key];
		}
	};
	return __I18N__;
});