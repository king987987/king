mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators:false
});

/*
* 1.进入页面，关键字显示在搜索框里
* 2.页面初始化完成之后，根据关键字显示对应的商品 显示4条
* 3.点击当前页面的搜索根据关键字重新再次渲染页面
* 4.点击排序 根据顺序的选项进行排序，可以选中的时候默认是升序 再点击就是降序
* 5.下拉页面的时候刷新页面
* 6.上拉页面的时候加载下一页，没有数据的时候要提示用户
*
* */
window.page=1;

//1.进入页面，关键字显示在搜索框里
var inputKey=LT.getParmas().key;
$(".search_input").val(inputKey);

// // 2.页面初始化完成之后，根据关键字显示对应的商品 显示4条
// getListDate({
//     proName:LT.getParmas().key,
//     page:1,
//     pageSize:4
// },function (data) {
//     $(".listBox_body").html(template("list",data));
// });

// 3.点击当前页面的搜索根据关键字重新再次渲染页面
$(".search_btn").on("tap",function () {
    var key=$.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    getListDate({
        proName:key,
        page:1,
        pageSize:4
    },function (data) {
        $(".listBox_body").html(template("list",data));
    });
    mui("#refreshContainer").pullRefresh().pulldownLoading();
});

//4.点击排序 根据顺序的选项进行排序，可以选中的时候默认是升序 再点击就是降序
$(".listBox_head_ul li").on("tap",function () {
    //改变listBox_now样式 并且改变箭头方向
    if($(this).hasClass("listBox_now")){
        var arrow=$(this).find("span");
        //arrowup
        if(arrow.hasClass("mui-icon-arrowdown")){
            arrow.addClass("mui-icon-arrowup").removeClass("mui-icon-arrowdown")
        }else{
            arrow.addClass("mui-icon-arrowdown").removeClass("mui-icon-arrowup")
        }
    }else{
        //没有就给当前的元素加上listBox_now 并且将其他listBox_now干掉
        $(this).addClass("listBox_now").siblings().removeClass("listBox_now").find("span").removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
    }

    /*通过自定义的属性拿到对应的数据*/
    var type=$(this).attr("data-type");
    // console.log(type);
    //根据箭头判断到底是升序还是降序
    var value=$(this).find("span").hasClass("mui-icon-arrowdown") ? 2 : 1;
    //重新渲染页面
    var key=$.trim($(".search_input").val());
    if(!key){
        mui.toast("请输入关键字");
        return false;
    }
    var obj={
        proName:key,
        page:1,
        pageSize:4
    };
    obj[type]=value;
    getListDate(obj,function (data) {
        $(".listBox_body").html(template("list",data));
    });
});

//5.下拉页面的时候刷新页面
mui.init({
    pullRefresh : {
        container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down : {
            style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
            auto: true,//可选,默认false.首次加载自动上拉刷新一次
            callback :function () {
                var key=$.trim($(".search_input").val());
                var _this=this;
                getListDate({
                    proName:key,
                    page:1,
                    pageSize:6
                },function (data) {
                    setTimeout(function () {
                        //排序列表按钮全部恢复默认状态
                        $(".listBox_head_ul li").removeClass("listBox_now").find("span").removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
                        $(".time").addClass("listBox_now");
                        $(".listBox_body").html(template("list",data));
                        //数据渲染结束后 停止刷新
                        _this.endPulldownToRefresh();
                        //重置上拉加载
                        _this.refresh(true);
                    },1000);
                });
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },

       //6.上拉页面的时候加载下一页，没有数据的时候要提示用户
        up : {
            callback :function () {
                window.page++;
                var _this=this;
                /*通过自定义的属性拿到对应的数据*/
                var type=$(this).attr("data-type");
                // console.log(type);
                //根据箭头判断到底是升序还是降序
                var value=$(this).find("span").hasClass("mui-icon-arrowdown") ? 2 : 1;
                //重新渲染页面
                var key=$.trim($(".search_input").val());
                if(!key){
                    mui.toast("请输入关键字");
                    return false;
                }
                var obj={
                    proName:key,
                    page:window.page,
                    pageSize:4
                };
                obj[type]=value;
                getListDate(obj,function (data) {
                    setTimeout(function () {
                        $(".listBox_body").html(template("list",data));
                        if(data.data.length){
                            _this.endPullupToRefresh();
                        }else{
                            //提示用户 没有数据
                            _this.endPullupToRefresh(true);
                        }
                    },1000);
                });
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
    }
});



//封装获取数据
function getListDate(parmas,callback) {
  $.ajax({
      url:"/product/queryProduct",
      type:"get",
      data:parmas,
      dataType:"json",
      success:function (data) {
          callback&&callback(data)
      }
  })
};