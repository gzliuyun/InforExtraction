// 修改词性标注模块中实体词数量

function drawPie(tagsNum){
    var wordsInfo = []
    if (tagsNum[0] != 0){
        var item = new Array();
        item["label"] = "名词";
        item["data"] = tagsNum[0];
        item["color"] = "#1ab394";
        wordsInfo.push(item);
    }
    if (tagsNum[1] != 0){
        var item = new Array();
        item["label"] = "动词";
        item["data"] = tagsNum[1];
        item["color"] = "#1c84c6";
        wordsInfo.push(item);
    }
    if (tagsNum[2] != 0){
        var item = new Array();
        item["label"] = "形容词";
        item["data"] = tagsNum[2];
        item["color"] = "#ed5565";
        wordsInfo.push(item);
    }
    if (tagsNum[3] != 0){
        var item = new Array();
        item["label"] = "副词";
        item["data"] = tagsNum[3];
        item["color"] = "#23c6c8";
        wordsInfo.push(item);
    }
    if (tagsNum[4] != 0){
        var item = new Array();
        item["label"] = "其它词";
        item["data"] = tagsNum[4];
        item["color"] = "#f8ac59";
        wordsInfo.push(item);
    }
    document.getElementById("flot-pie-chart").innerHTML = "";
    var plotObj = $.plot($("#flot-pie-chart"), wordsInfo, {
        series: {
            pie: {
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        legend: {
            show: false,
            location: 'e'
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    });
}
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

function show_word_tag(wordsList,tagsList){
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
}

//词频展示
function wordsCountShow(topWordsCountList){
    var chart = echarts.init(document.getElementById("wordsCount"));
    var words = [];
    var counts = [];
    for (var idx = 0; idx < topWordsCountList.length; idx++){
        var wc = topWordsCountList[idx];
        words.push(wc[0]);
        counts.push(wc[1]);
    }
    var option = {
        tooltip : {
            trigger: 'axis'
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : {
                data :words
        },
        yAxis : {},
        series : [
            {
                name:'词频',
                type:'bar',
                data:counts,
            }
        ]
    };
    chart.setOption(option);

}

function show_entity_extract(entityDict){
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
}

function show_attribute_extract(attributeDict){
    // 属性人名抽取 展示
    namesList = attributeDict.name;
    var row_names = document.getElementById("row_name");
    row_names.innerHTML = "";
    for(var index = 0; index < namesList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = namesList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_names.appendChild(node);
    }
    // 属性毕业院校抽取 展示
    universityList = attributeDict.university;
    var row_university = document.getElementById("row_university");
    row_university.innerHTML = "";
    for(var index = 0; index < universityList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = universityList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_university.appendChild(node);
    }
    // 属性抽取--专业抽取 展示
    majorList = attributeDict.major;
    var row_major = document.getElementById("row_major");
    row_major.innerHTML = "";
    for(var index = 0; index < majorList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = majorList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_major.appendChild(node);
    }

    // 属性抽取--学历抽取 展示
    educationList = attributeDict.education;
    var row_education = document.getElementById("row_education");
    row_education.innerHTML = "";
    for(var index = 0; index < educationList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = educationList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_education.appendChild(node);
    }

    //属性抽取--职务抽取 展示
    jobList = attributeDict.job;
    var row_job = document.getElementById("row_job");
    row_job.innerHTML = "";
    for(var index = 0; index < jobList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = jobList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_job.appendChild(node);
    }

    //属性抽取--出生地抽取 展示
    birthplaceList = attributeDict.birthplace;
    var row_birthplace = document.getElementById("row_birthplace");
    row_birthplace.innerHTML = "";
    for(var index = 0; index < birthplaceList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = birthplaceList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_birthplace.appendChild(node);
    }

    //属性抽取--民族抽取 展示
    nationList = attributeDict.nation;
    var row_nation = document.getElementById("row_nation");
    row_nation.innerHTML = "";
    for(var index = 0; index < nationList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = nationList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_nation.appendChild(node);
    }

    //属性抽取--性别抽取 展示
    genderList = attributeDict.gender;
    var row_gender = document.getElementById("row_gender");
    row_gender.innerHTML = "";
    for(var index = 0; index < genderList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = genderList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_gender.appendChild(node);
    }

    //属性抽取--工作地点抽取 展示
    workplaceList = attributeDict.workplace;
    var row_workplace = document.getElementById("row_workplace");
    row_workplace.innerHTML = "";
    for(var index = 0; index < workplaceList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = workplaceList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_workplace.appendChild(node);
    }

    //属性抽取--政党抽取 展示
    partyList = attributeDict.party;
    var row_party = document.getElementById("row_party");
    row_party.innerHTML = "";
    for(var index = 0; index < partyList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = partyList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_party.appendChild(node);
    }

    //属性抽取--入党时间抽取 展示
    jointimeList = attributeDict.jointime;
    var row_jointime = document.getElementById("row_jointime");
    row_jointime.innerHTML = "";
    for(var index = 0; index < jointimeList.length; index ++){
        var node = document.createElement("a");
        node.innerHTML = jointimeList[index];
        node.setAttribute("class","btn btn-xs btn-default");
        node.setAttribute("style","margin: 2px; background-color: rgb(136, 136, 136); border-color: rgb(136, 136, 136);");
        row_jointime.appendChild(node);
    }
}

function sbt_txt(){
    //variable_init();
    var input_textarea = $("#input_textarea").val();  
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
		url:"/attributes/txt/submit/", //请求url
        data: {
            'input_textarea': input_textarea
        },
        success:function(result){ //提交成功的回调函数,
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
            // 获取关键词列表
            //var keyWords = ret.keyWords;
            var attributes = ret.attributeDict;//属性列表
            {
                // 属性抽取展示
                show_attribute_extract(attributes);
                //属性展示模块，高度设置
                var attributeTable = document.getElementById("attribute_extract_table");
                var tableHeight1 = attributeTable.offsetHeight;
                // document.getElementById("relSen_btBox").style.height = tableHeight + 'px';
                var attributeTabBox = document.getElementById("attributeTable");
                attributeTabBox.style.height =  tableHeight1 + 90 + "px";
            }
            // 词性标注展示
            show_word_tag(wordsList,tagsList);
            // 修改饼状图数据，调用load-data.js中的drawPie绘图函数。
            // 数组深度克隆，使用slice(0)函数，绘制饼状图，并修改实体词数量
            nowNum = tagsNum.slice(0);
            drawPie(tagsNum);
            nowPunct = punct;
            modNumber(nowNum,punct);

            {
                // 实体抽取展示
                show_entity_extract(entityDict);
                //实体抽取展示模块，高度设置
                var entieyTable = document.getElementById("entity_extract_table");
                var tableHeight = entieyTable.offsetHeight;
                // document.getElementById("relSen_btBox").style.height = tableHeight + 'px';
                var entityTabBox = document.getElementById("entityTable");
                entityTabBox.style.height =  tableHeight + 90 + "px";
            }
            {
                // 词频统计部分展示
                wordsCountShow(topWordsCountList);
                var wordsCountForm = document.getElementById("wordsCount");
                var wordsCountHeight = wordsCountForm.offsetHeight;
                // document.getElementById("relSen_btBox").style.height = tableHeight + 'px';
                var wordsCountBox = document.getElementById("wordsCountBox");
                wordsCountBox.style.height =  wordsCountHeight + 15 + "px";
            }



        }
    });
}

