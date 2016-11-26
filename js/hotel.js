//解析地址栏参数
var is=new iScroll("hotel_scroll");
var params=getparams();
var cityId=params.city_id,
	dateIn=params.date_in,
	dateOut=params.date_out,
	name=params.name?params.name:"",
	pageNo=1,
	pageSize=4;
	POST={
		cityId:cityId,
		dateIn:dateIn,
		dateOut:dateOut,
		pageNo:pageNo,
		pageSize:pageSize
	}
	if(name){
		POST.name=name;
	}
//显示入住和离店日期
	$("#inText").text(strTodate(dateIn));
	$("#outText").text(strTodate(dateOut));
	$("#date_in").val(strTodate(dateIn));
	$("#date_out").val(strTodate(dateOut));
enlCalend()
//ajax请求
function getdateforhotel(action){
	console.log(POST)
	common._ajax("../server/hotel.php",POST,function(data){
		//console.log(data)
		randerHotelList(data,action)
	});
}
//渲染列表
function randerHotelList(datas,action){
	if(datas.errcode==1){
		$("#tipbox").css("display","block");
		$("#hotel_list").empty();
	}else{
		$("#tipbox").css("display","none");
		var html="";
		var count=datas.count;
		var data=datas.result.hotel_list;
		console.log(count)
			$.each(data,function(i,obj){
				html+='<div class="rows">'
						+'<a href="detail.html?&city_id='+cityId+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'&hotel_id='+obj.hotel_id+'&hotel_name='+encodeURI(obj.name)+'">'
							+'<dl>'
								+'<dt>'
									+'<img src="../img/01.jpg">'
								+'</dt>'
								+'<dd>'
									+'<h2>'+obj.name+'</h2>'	
									+'<p class="tip">'
										+'<span>4.5分</span>'
										+'<em>礼</em>'
										+'<em>促</em>'
										+'<em>返</em>'
									+'</p>'
									+'<p class="stars">'+obj.stars+'</p>'
									+'<p class="address">'+obj.addr+'</p>'
								+'</dd>'
								+'<dd>'
									+'<p>'+obj.low_price/100+'<p>'
								+'</dd>'
							+'</dl>'
						+'</a>'
					+'</div>';
			})
			if(POST.pageNo*POST.pageSize<count){
				$(".load_more").css("display","block");
			}else{
				$(".load_more").css("display","none");	
			}
			//如果action为假，表示重新渲染页面
			if(!action) $("#hotel_list").empty();
			$(html).appendTo($("#hotel_list"));
			is.refresh();
	}
}

function bingEvent(){
	//给加载更多绑定事件
	$(".load_more").on("click",function(){
		POST.pageNo+=1;
		getdateforhotel("load_more")
	})
	//点击导航切换选项
	$("#ftnav").on("click","a",function(){
		var index=$(this).index();
		var $lay=$("#item_layer");
		common.showmark()
		$lay.css({
			"-webkit-transition":"height 0.3 ease-in-out",
			"height":"25rem"
		})
		$lay.addClass("cur_item").siblings().removeClass("cur_item")
		$lay.children("div").eq(index).addClass("cur_layer").siblings().removeClass("cur_layer")
	})

}
bingEvent()
//上滑出现导航
function showNav(){
	var starty,offsety;
	 var $ftnav = $('#ftnav');
	$("#hotel_scroll").on("touchstart",function(e){
		 starty=e.touches[0].clientY;
	})
	$("#hotel_scroll").on("touchmove",function(e){
		 offsety=e.touches[0].clientY-starty;
	})
	$("#hotel_scroll").on("touchend",function(e){
		var abs_offsety=Math.abs(offsety);
		console.log(abs_offsety)
		if(abs_offsety>20){
			if(offsety<0){
				$ftnav.css({
					"-webkit-transition":"height 0.3s linear",
					"height":"3rem"
				})
			}else{
				$ftnav.css({
					"-webkit-transition":"height 0.3s linear",
					"height":"0rem"
				})
			}
		}
	})
}
showNav();
var sort = {
        'all': '不限',
        'hot': '人气最高',
        'priceMax': '价格从高到低',
        'priceMin': '价格从低到高'
    };
    //渲染排序
    function randerSort(){
    	/*var html="<ul>";
    	$.each(sort,function(i,text){
    		html+='<li>'
    				+'<a href="javascript:void(0)">'
    					+'<span onclick="checksort"></span>'
    					+'<b>'+text+'</b>'
    				+'</a>'
    			+'</li>';
    	})*/
      var htmlArr=["<ul>"]
      $.each(sort,function(i,text){
      	htmlArr.push('<li id="' + i + '">',
      				'<a href="javascript:void(0)">',
      				'<span onclick="checkSort(\'' + i + '\')"></span>',
      				'<b>'+text+'</b>',
      				'</a>',
      				'</li>')
      })
      htmlArr.push("</ul>")
    	$("#sort").html(htmlArr.join("")).find("li").eq(0).addClass("on")
    }
     randerSort();
    //选择排序
    function checkSort(i){
    	var $parent = $('#' + i);
    	$parent.addClass('on').siblings().removeClass('on');
    	hideLayer();
    	var v = i === 'all' ? -1 : i;
    	$('#order').val(v);
    	//ajax请求
    	POST.sortType = $('#order').val();
    	getdateforhotel()
    }

  var price = {
        '0': ['不限', -1, -1],
        '1': ['0-100', 0, 100],
        '2': ['101-200', 101, 200],
        '3': ['201-300', 201, 300],
        '4': ['301-400', 301, 400],
        '5': ['401-500', 401, 500],
        '6': ['500以上', 500, -1]
    }
    //渲染价格
    function randerPrice(price){
    	var html="<ul>";
    	$.each(price,function(k,texts){
    		html+='<li id="item'+k+'">'
    				+'<a href="javascript:void(0)">'
    					+'<span onclick="checkPrice('+k+','+texts[1]+','+texts[2]+')"></span>'
    					+'<b>'+texts[0]+'</b>'
    				+'</a>'
    			+'</li>'
    	})
    	$("#price").html(html).find("li").eq(0).addClass("on");
    }
    randerPrice(price);
    //选择价格
    function checkPrice(k,min,max){
    	hideLayer();
    	$("#item"+k).addClass("on").siblings().removeClass("on");
    	min=min===-1?-100:min*100;
    	max=max===-1?-100:max*100;
    	$("#min").val(min);
    	$("#max").val(max);
    	POST.minPrice=$("#min").val();
    	POST.maxPrice=$("#max").val();
    	getdateforhotel()

    }
    var brand = {
        '10': '不限',
        '12': '喜来登',
        '15': '如家',
        '18': '万豪',
        '35': '香格里拉',
        '39': '速8',
        '44': '莫泰168',
        '48': '汉庭',
        '49': '全季',
        '50': '锦江之星',
        '53': '里程',
        '68': '桔子',
        '110': '如家快捷',
        '132': '7天',
        '160': '布丁',
        '168': '格林豪泰',
        '286': '尚客优'
    }
    //渲染品牌
    function randerBrand(brand){
    	var html="<ul>";
    	$.each(brand,function(k,texts){
    		html+='<li id="b'+k+'">'
    				+'<a href="javascript:void(0)">'
    					+'<span onclick="checkBrand('+k+',\''+texts+'\')"></span>'
    					+'<b>'+texts+'</b>'
    				+'</a>'
    			+'</li>'
    	})
    	html+='</ul>'
    	$("#bran").html(html).find("li").eq(0).addClass("on");
    }
    randerBrand(brand)
    //选择品牌
    function checkBrand(num,name){
    	$("#b"+num).addClass("on").siblings().removeClass("on");
    	hideLayer();
    	  num = num === 10 ? -1 : name;
    	  $('#brand').val(num);
    	  POST.brand = $('#brand').val();
    	  getdateforhotel()
    }
    //渲染星级
    var stars = {
        '0': '不限',
        '2': '二星以下/经济型',
        '3': '三星',
        '4': '四星',
        '5': '五星'
    }
    function randerStar(stars){
    	var html="<ul>";
    	$.each(stars,function(k,texts){
    		html+='<li id="s'+k+'">'
    				+'<a href="javascript:void(0)">'
    					+'<span onclick="checkStart('+k+')"></span>'
    					+'<b>'+texts+'</b>'
    				+'</a>'
    			+'</li>'
    	})
    	html+='</ul>'
    	$("#sta").html(html).find("li").eq(0).addClass("on");
    }
    randerStar(stars);
    function checkStart(k){
        hideLayer();
    	$("#s"+k).addClass("on").siblings().removeClass("on");
        k=k===0?-1:k;
        $("#star").val(k);
        POST.stars=$("#star").val();
         getdateforhotel()
    }
    //隐藏弹层
    function hideLayer() {
        setTimeout(function () {
            $('#item_layer').css({
                '-webkit-transition': 'height 0.3s linear',
                'height': '0'
            })
            common.hidemark();
        }, 100)
    }
  
getdateforhotel();
