$(function () {
    //1.获取地址列表 渲染页面
    gatAddressData(function (data) {
        // console.log(data);
        $(".mui-table-view").html(template("addressList",{list:data}))
    });
    //2.删除对应的地址列表
    //(事件委托 找父亲)
    $(".mui-table-view").on("tap",".mui-btn-red",function () {
        var id=$(this).attr("data-id");
        // console.log(id);
        deleteAddressData({id:id},function (data) {
            // console.log(data);
            if(data.success){
                //如果返回成功 重新渲染页面
                gatAddressData(function (data) {
                    // console.log(data);
                    $(".mui-table-view").html(template("addressList",{list:data}))
                });
            }
        })
    })


    function gatAddressData(callback) {
        LT.loginAjax({
            url:"/address/queryAddress",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                callback&&callback(data);
            }
        })
    }
  //删除接口
    function deleteAddressData(parmas,callback) {
        LT.loginAjax({
            url:"/address/deleteAddress",
            type:"post",
            data:parmas,
            dataType:"json",
            success:function (data) {
                callback&&callback(data);
            }
        })
    }
})