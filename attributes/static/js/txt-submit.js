

function sbt_txt() {
    console.log("####################");
    variable_init();
    var input_textarea = $("#input_textarea").val();  
    $.ajax({
        type:"get",  //提交方式
        dataType:"text", //数据类型
        url:"/attributes/txt/submit/", //请求url
        data: {
            'input_textarea': input_textarea
        },
        success:function(result){ //提交成功的回调函数
            var ret = eval("("+result+")");
            var attributes = ret.attributeDict;//属性列表

        }
    });
}

