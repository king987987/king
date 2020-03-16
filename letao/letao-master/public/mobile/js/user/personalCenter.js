$(function () {
    //渲染页面
    getquery(function (data) {
        $(".mui-table-view").html(template("query",data))
    });

    function getquery(callback) {
        LT.loginAjax({
            url: "/user/queryUserMessage",
            type: "get",
            data: "",
            success: function (data) {
                // console.log(data);
                callback&&callback(data);
            }
        })
    }

    //退出登录
    $(".mui-btn-outlined").on("tap",function () {
        setUserData(function (dara) {
            //清除后台数据后返回最后的页面
            location.href="/mobile/user/login.html?returnURL="+location.href;
        })
    });

    // setUserData();
    /*获取后台用户登录数据*/
    function setUserData(callback) {
        LT.loginAjax({
            url:"/user/logout",
            type:"get",
            data:"",
            dataType:"json",
            success:function (data) {
                // console.log(data);
                callback&&callback(data)
            }
        })
    }
});