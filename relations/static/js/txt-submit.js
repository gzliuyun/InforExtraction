// 修改词性标注模块中实体词数量
function modNumber(numList,pct){
    var entityWords = numList[0] + numList[1] + numList[2] + numList[3] + numList[4];
    document.getElementById("tag_words_count").innerHTML = "" + entityWords;
    document.getElementById("tag_entity_count").innerHTML = "" + (entityWords - pct);
    document.getElementById("tag_entity_rate").style.width = (entityWords - pct)/entityWords * 100 +"%";
}

$(document).ready(function(){
    // $.ajaxSetup({
    //     data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    // });
    // tag数量统计
    var tagsNum = [0,0,0,0,0];
    // 当前展示的tag数量
    var nowNum = [0,0,0,0,0];
    // 统计标点符号数量
    var punct = 0; 
    // 当前显示的标点符号数量
    var nowPunct = 0;
    $("#textFrom").submit(function(){
        var input_textarea = $("#input_textarea").val();  
        $.ajax({
            type:"get",  //提交方式
            dataType:"text", //数据类型
            url:"/relations/txt/submit/", //请求url
            data: {
                'input_textarea': input_textarea
            },
            success:function(result){ //提交成功的回调函数

                // var result = eval(ret);
                var ret = eval("("+result+")");
                var paragraphList = ret.text;
                var text = "";
                for (var i = 0; i < paragraphList.length; i++){
                    text += paragraphList[i] ;
                }
                $('#passage_txt').html(text);

                var wordsList = ret.wordsList;
                var tagsList = ret.tagsList;

                var tags = document.getElementById("tag_result");
                tags.innerHTML = "";
                
                for (var index = 0; index < wordsList.length; index ++){
                    var labelNode = document.createElement("a");
                    labelNode.innerHTML = wordsList[index];

                    if (tagsList[index] == "noun"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-primary btn-style noun");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 名词<br>词性标注: " + tagsList[index]);
                        tagsNum[0] += 1;
                    }
                    else if (tagsList[index] == "verb"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-success btn-style verb");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 动词<br>词性标注: " + tagsList[index]);
                        tagsNum[1] += 1;
                    }
                    else if (tagsList[index] == "adjective"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-danger btn-style adjective");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 形容词<br>词性标注: " + tagsList[index]);
                        tagsNum[2] += 1;
                    }
                    else if (tagsList[index] == "adverb"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-info btn-style adverb");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 副词<br>词性标注: " + tagsList[index]);
                        tagsNum[3] += 1;
                    }
                    else if (tagsList[index] == "punctuation mark" ){
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-warning btn-style other");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 其它词<br>词性标注: " + tagsList[index]);
                        punct += 1;
                        tagsNum[4] += 1;
                    }
                    else{ 
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-warning btn-style other");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 其它词<br>词性标注: " + tagsList[index]);
                        tagsNum[4] += 1;
                    }
                    labelNode.setAttribute("data-toggle", "tooltip");
                    labelNode.setAttribute("data-placement", "top");
                    labelNode.setAttribute("data-html", "true");
                    labelNode.style.margin = "0px 2px 5px 2px";

                    tags.appendChild(labelNode);
                }
                // 修改饼状图数据，调用load-data.js中的drawPie绘图函数。
                // 数组深度克隆，使用slice(0)函数，绘制饼状图，并修改实体词数量
                nowNum = tagsNum.slice(0);
                drawPie(tagsNum);
                nowPunct = punct;
                modNumber(nowNum,punct);
            }
        });
        return false; //不刷新页面
    });

    //iCheck初始化 
    $('.i-check').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass:'iradio_square-green'
    })
    // checkbox选择，取消监听
    $('input').on('ifChecked', function(event){
        var eventId = this.id;
        // 按照类名选择
        var aList = document.querySelectorAll("." + eventId);
        for (var i = 0; i < aList.length; i++){
            aList[i].style.display="";
        }
        if (eventId == "noun")
            nowNum[0] += tagsNum[0];
        else if (eventId == "verb")
            nowNum[1] += tagsNum[1];
        else if (eventId == "adjective")
            nowNum[2] += tagsNum[2];
        else if (eventId == "adverb")
            nowNum[3] += tagsNum[3];
        else if (eventId == "other"){
            nowNum[4] += tagsNum[4];
            nowPunct += punct; 
        }
        // 绘制饼状图，并修改实体词数量
        drawPie(nowNum);
        modNumber(nowNum,nowPunct);

    });
    $('input').on('ifUnchecked', function(event){
        // alert(this.id + " isUnchecked");
        var eventId = this.id;
        // 按照类名选择
        var aList = document.querySelectorAll("." + eventId);
        for (var i = 0; i < aList.length; i++){
            aList[i].style.display="none";
        }
        // 重绘制饼状图
        if (eventId == "noun")
            nowNum[0] -= tagsNum[0];
        else if (eventId == "verb")
            nowNum[1] -= tagsNum[1];
        else if (eventId == "adjective")
            nowNum[2] -= tagsNum[2];
        else if (eventId == "adverb")
            nowNum[3] -= tagsNum[3];
        else if (eventId == "other"){
            nowNum[4] -= tagsNum[4];
            nowPunct -= punct; 
        }
        // 绘制饼状图，并修改实体词数量
        drawPie(nowNum);
        modNumber(nowNum,nowPunct);

    });
});