$(document).ready(function(){
    // $.ajaxSetup({
    //     data: {csrfmiddlewaretoken: '{{ csrf_token }}' },
    // });
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
                var tagsNum = [0,0,0,0,0];
                // 统计标点符号数量
                var punct = 0; 
                for (var index = 0; index < wordsList.length; index ++){
                    var labelNode = document.createElement("a");
                    labelNode.innerHTML = wordsList[index];

                    if (tagsList[index] == "noun"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-primary btn-style");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 名词<br>词性标注: " + tagsList[index]);
                        tagsNum[0] += 1;
                    }
                    else if (tagsList[index] == "verb"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-success btn-style");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 动词<br>词性标注: " + tagsList[index]);
                        tagsNum[1] + 1;
                    }
                    else if (tagsList[index] == "adjective"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-danger btn-style");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 形容词<br>词性标注: " + tagsList[index]);
                        tagsNum[2] += 1;
                    }
                    else if (tagsList[index] == "adverb"){                       
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-info btn-style");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 副词<br>词性标注: " + tagsList[index]);
                        tagsNum[3] += 1;
                    }
                    else if (tagsList[index] == "punctuation mark" ){
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-warning btn-style");
                        labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 其它词<br>词性标注: " + tagsList[index]);
                        punct += 1;
                        tagsNum[4] += 1;
                    }
                    else{ 
                        labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-warning btn-style");
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
                drawPie(tagsNum);
                var entityWords = tagsNum[0] + tagsNum[1] + tagsNum[2] + tagsNum[3] + tagsNum[4];
                document.getElementById("tag_words_count").innerHTML = "" + entityWords;
                document.getElementById("tag_entity_count").innerHTML = "" + (entityWords - punct);

            }
        });

        return false; //不刷新页面
    });
});