

function home_txt() {
    console.log("####################");
    //var input_textarea = $("#input_textarea").val();  
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/home/txt/submit/", //请求url
        data: {
            //'people_num': input_textarea
        },
        success:function(result){ //提交成功的回调函数
            var ret = eval("("+result+")");
            var peopleNum = ret.people_num;


            $("#people-num").text( peopleNum);
  
        }
    });
}

