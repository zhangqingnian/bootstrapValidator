/***
 * argumetns[0] 
**/
(function(root,factory,plug){
	factory.call(root,root.jQuery,plug)
})(this,function($,plug){
	//this ==> root ==> window
	//默认参数
	var __DEFS__ = {
		raise : "change",
		lang : I18N.EN
	};
	//规则引擎
	var __RULES__ = {
		"required" : function(){
			return this.val()!="";
		},
		"email" : function(){
			return /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.val());
		},
		"mobile" : function(){
			return /^1\d{10}$/.test(this.val());
		},
		"regex" : function(){
			return new RegExp(this.data("bv-regex")).test(this.val());
		},
		"amount" : function(){
			return  /^([1-9][0-9]*)?[0-9]\.[0-9]{2}$/.test(this.val());
		},
		"integer" : function(){
			return true;
		},
		"min" : function(){
			return true;
		},
		"max" : function(){
			return true;
		}
	}
	function showMessage(t,$f,rule){
		var msg = $f.data("bv-"+rule+"-message");
		//校验失败
		if(msg){
			$f.after("<p class='text-danger'>"+msg+"</p>");
		}else{
			$f.after("<p class='text-danger'>has error</p>");
		}
		if($f.is(":hidden")){
			var index = $f.parents(".tab-pane").index()
			$f.parents(".tab-content").prev().find("a").eq(index).tab('show')
		}
	}
	var __EN__ = {
		"no_form" : "element must be form"
	}
	$.fn[plug] = function(opts){
		$.extend(this,__DEFS__,opts);
		I18N.install(this,plug);
		this.language(I18N.EN,__EN__);//默认英语国际化
		if(!this.is("form")){
			throw new Error(this.getMessage(this.lang,"no_form"));
			return
		}
		var that = this;
		var $fields = this.find("input[type=text],textarea,select");//找到需要被校验的表单元素
		$fields.on(this.raise,function(){
			var $field = $(this);//当前被校验的表单元素
			var result = false;//校验结果，默认为false
			var $group = $field.parents(".form-group:first");//找到对应的group
			//先清除上一次校验的状态
			$group.removeClass("has-success has-error").children("p.text-danger").remove();
			//迭代规则
			$.each(__RULES__,function(rule,valid){
				//判断有没有配置对应的规则
				if($field.data("bv-"+rule)){
					//如果配置了就会进来
					result = valid.call($field);//调用某个rule的验证，返回结果
					$group.addClass(result?"has-success":"has-error");
					if(!result){
						showMessage(that,$field,rule);//提示错误信息
						return false;
					}
				}
			});
		});
		this.on("submit",function(){
			var $fields = $(this).find("input[type=text],textarea,select");
			$fields.trigger(that.raise);//手工的触发所有field的校验事件
			//如果都校验成功，size==0
			console.log($fields.parents(".form-group.has-error").size())
			if($fields.parents(".form-group.has-error").size()==0){
				this.submit();
			}
			return false;
		})
	}
	$.fn[plug].extendRule = function(rules){
		$.extend(__RULES__,rules)
	}
},"bootstrapValidator");