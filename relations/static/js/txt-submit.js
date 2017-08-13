// 修改词性标注模块中实体词数量

var tagsNum = [0,0,0,0,0];
// 当前展示的tag数量
var nowNum = [0,0,0,0,0];
// 统计标点符号数量
var punct = 0; 
// 当前显示的标点符号数量
var nowPunct = 0;

// 全局变量初始化
function variable_init(){
    tagsNum = [0,0,0,0,0];
    nowNum = [0,0,0,0,0];
    punct = 0;
    nowPunct = 0;
}
function modNumber(numList,pct){
    var entityWords = numList[0] + numList[1] + numList[2] + numList[3] + numList[4];
    document.getElementById("tag_words_count").innerHTML = "" + entityWords;
    document.getElementById("tag_entity_count").innerHTML = "" + (entityWords - pct);
    document.getElementById("tag_entity_rate").style.width = (entityWords - pct)/entityWords * 100 +"%";
}

function sbt_txt(){
    variable_init();
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
            // 获取分词列表
            var wordsList = ret.wordsList;
            // 获取词性标注列表
            var tagsList = ret.tagsList;
            // 获取词频统计列表
            var topWordsCountList = ret.topWordsCount;
            // 获取实体抽取字典，包含人名，地名等
            var entityDict = ret.entityDict;
            // 获取关系语句列表，其元素为字典，每个字典包含一条关系语句senence和一个人名列表。
            var relSentenceList =  ret.relSentenceList
            var tags = document.getElementById("tag_result");
            tags.innerHTML = "";
            
            for (var index = 0; index < wordsList.length; index ++){
                var labelNode = document.createElement("a");
                labelNode.innerHTML = wordsList[index];
                tag = tagsList[index];
                // 名词
                if (tag == "n" || tag == "nd" || tag =="nh" || tag =="ni"|| tag == "nl" || tag == "ns" || tag == "nt" || tag == "nz"){                       
                    labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-primary btn-style noun");
                    labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 名词<br>词性标注: " + tagsList[index]);
                    tagsNum[0] += 1;
                }
                // 动词
                else if (tag == "v"){                       
                    labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-success btn-style verb");
                    labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 动词<br>词性标注: " + tagsList[index]);
                    tagsNum[1] += 1;
                }
                // 形容词
                else if (tag == "a" || tag == "b"){                       
                    labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-danger btn-style adjective");
                    labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 形容词<br>词性标注: " + tagsList[index]);
                    tagsNum[2] += 1;
                }
                // 副词
                else if (tag == "d"){                       
                    labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-info btn-style adverb");
                    labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 副词<br>词性标注: " + tagsList[index]);
                    tagsNum[3] += 1;
                }
                // 标点符号
                else if (tag == "wp" ){
                    labelNode.setAttribute("class", "btn btn-xs btn-rounded btn-warning btn-style other");
                    labelNode.setAttribute("data-original-title","词性还原：" + wordsList[index] + "<br>实体类型: 其它词<br>词性标注: " + tagsList[index]);
                    punct += 1;
                    tagsNum[4] += 1;
                }
                // 其它
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
            // 词频统计部分展示
            wordsCountShow(topWordsCountList);
            // 实体抽取--人名抽取 展示
            namesList = entityDict.names;
            var row_names = document.getElementById("row_names");
            row_names.innerHTML = "";
            for(var index = 0; index < namesList.length; index ++){
                var node = document.createElement("a");
                node.innerHTML = namesList[index];
                node.setAttribute("class","btn btn-xs btn-default");
                node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
                row_names.appendChild(node);
            }
            // 实体抽取--地名抽取 展示
            placesList = entityDict.places;
            var row_places = document.getElementById("row_places");
            row_places.innerHTML = "";
            for(var index = 0; index < placesList.length; index ++){
                var node = document.createElement("a");
                node.innerHTML = placesList[index];
                node.setAttribute("class","btn btn-xs btn-default");
                node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
                row_places.appendChild(node);
            }
            // 实体抽取--地名抽取 展示
            orgsList = entityDict.orgs;
            var row_orgs = document.getElementById("row_orgs");
            row_orgs.innerHTML = "";
            for(var index = 0; index < orgsList.length; index ++){
                var node = document.createElement("a");
                node.innerHTML = orgsList[index];
                node.setAttribute("class","btn btn-xs btn-default");
                node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
                row_orgs.appendChild(node);
            }

            // 实体抽取--时间抽取 展示
            timesList = entityDict.times;
            var row_times = document.getElementById("row_times");
            row_times.innerHTML = "";
            for(var index = 0; index < timesList.length; index ++){
                var node = document.createElement("a");
                node.innerHTML = timesList[index];
                node.setAttribute("class","btn btn-xs btn-default");
                node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
                row_times.appendChild(node);
            }
            // 关系语句抽取，展示
            // 已在视图中写入json文件，自动加载
            relSenTable();
        }
    });
}

