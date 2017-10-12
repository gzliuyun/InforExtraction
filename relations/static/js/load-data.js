// $(document).ready(function(){

//     // $('input').iCheck('uncheck')
// });

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

// 关系力导向图
function drawRelationCharts(relTableData){
    var relationDiv = document.getElementById('relation_panel')
    var relationChart = echarts.init(relationDiv);
    
    var namesSet = new Set(); 
    var linksData = new Array() ;
    var nodesData = new Array() ;    
    for(var i = 0; i < relTableData.length; i++){
        relItem = relTableData[i];
        name1 = relItem["name1"];
        name2 = relItem["name2"];
        relation = relItem["relation"];
        namesSet.add(name1);
        namesSet.add(name2);

        item = {};
        item["source"] = name1;
        item["target"] = name2;
        item["weight"] = Math.floor(Math.random()*6 + 1);
        item["name"] = relation;

        linksData.push(item);

    }
    namesSet.forEach(function(name){
        node = {};
        node["category"] = 0;
        node["name"] = name;
        node["value"] = Math.floor(Math.random()*9 + 1);

        nodesData.push(node);
    })

    relationOption = {
        title : {
            text: '人物关系',
            x:'right',
            y:'bottom'
        },
        tooltip : {
            trigger: 'item',
            formatter: '{a} : {b}'
        },
        toolbox: {
            show : true,
            feature : {
                restore : {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage : {show: true}
            }
        },
        backgroundColor: '#ffffff',
        series : [
            {
                type:'force',
                name : "人物关系",
                ribbonType: false,
                categories : [
                    {
                        name: '人物'
                    }
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        nodeStyle : {
                            brushType : 'both',
                            borderColor : 'rgba(255,215,0,0.4)',
                            borderWidth : 1
                        },
                        linkStyle: {
                            type: 'curve'
                        }
                    },
                    emphasis: {
                        label: {
                            show: false
                            // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                        },
                        nodeStyle : {
                            //r: 30
                        },
                        linkStyle : {}
                    }
                },
                useWorker: false,
                minRadius : 15,
                maxRadius : 25,
                gravity: 1.1,
                scaling: 1.1,
                roam: 'move',
                nodes:nodesData,
                links : linksData
            }
        ]
    };
    relationChart.setOption(relationOption);
    // relationDiv.setAttribute("style","height: 380px;")
}
// 词性说明函数
function tag_description() {
    var tag_chn_li =
        [{"num":"1","abbr":"a","chn":"形容词","en":"adjective"},
        {"num":"2","abbr":"b","chn":"其它名字修饰","en":"other noun-modifier"},
        {"num":"3","abbr":"c","chn":"连词","en":"conjunction"},
        {"num":"4","abbr":"d","chn":"动词","en":"adverb"},
        {"num":"5","abbr":"e","chn":"叹词","en":"exclamation"},
        {"num":"6","abbr":"g","chn":"词素、形态素","en":"morpheme"},
        {"num":"7","abbr":"h","chn":"前缀","en":"prefix"},
        {"num":"8","abbr":"i","chn":"成语、习语","en":"idiom"},
        {"num":"9","abbr":"j","chn":"缩词、缩写词","en":"abbreviation"},
        {"num":"10","abbr":"k","chn":"后缀、下标","en":"suffix"},
        {"num":"11","abbr":"m","chn":"数量词","en":"number"},
        {"num":"12","abbr":"n","chn":"常用名词","en":"general noun"},
        {"num":"13","abbr":"nd","chn":"方位名词","en":"direction noun"},
        {"num":"14","abbr":"nh","chn":"人名","en":"person name"},
        {"num":"15","abbr":"ni","chn":"机构名称","en":"organization name"},
        {"num":"16","abbr":"nl","chn":"位置名词","en":"location noun"},
        {"num":"17","abbr":"ns","chn":"地理名称","en":"geographical name"},
        {"num":"18","abbr":"nt","chn":"时间名称","en":"temporal noun"},
        {"num":"19","abbr":"nz","chn":"其它专有名词","en":"other proper noun"},
        {"num":"20","abbr":"o","chn":"拟声、声喻法","en":"onomatopoeia"},
        {"num":"21","abbr":"p","chn":"介词、前置词","en":"preposition"},
        {"num":"22","abbr":"q","chn":"量词","en":"quantity"},
        {"num":"23","abbr":"r","chn":"代词","en":"pronoun"},
        {"num":"24","abbr":"u","chn":"助动词","en":"auxiliary"},
        {"num":"25","abbr":"v","chn":"动词","en":"to"},
        {"num":"26","abbr":"wp","chn":"标点符号","en":"punctuation"},
        {"num":"27","abbr":"ws","chn":"外语词汇","en":"foreign words"},
        {"num":"28","abbr":"x","chn":"无语义词","en":"non-lexeme"},
        {"num":"29","abbr":"z","chn":"描述词","en":"descriptive words"}];
    var tbody = $("#tag_discription_table tbody");
    tbody.empty();
    $.each(tag_chn_li, function (offset, tag_chn) {
        var childdiv=$("<tr></tr>");
        $("<td>"+tag_chn['num']+"</td>").appendTo(childdiv);
        $("<td>"+tag_chn['abbr']+"</td>").appendTo(childdiv);
        $("<td>"+tag_chn['chn']+"</td>").appendTo(childdiv);
        $(childdiv).appendTo(tbody);
    })
}
// 人物关系语句展示
function relSenTable(relTableData){
    // 在重新载入数据之前，需要先注销表
    $("#relation_sentence_table").bootstrapTable('destroy'); 
    $('#relation_sentence_table').bootstrapTable({
            data: relTableData,
            queryParams:"queryParams",
            striped: true,
            sortable: true,               
            sortOrder: "asc",
            pagination:"true",
            search:"true",
            showRefresh:"true",
            showToggle:"true",
            showColumns:"true",
            pageList: [5],
            pageSize:"5",
            columns: [{
                field: 'idx',
                title: '序号'
            }, {
                field: 'sentence',
                title: '关系语句'
            }, {
                field: 'name1',
                title: '姓名1'
            }, {
                field: 'name2',
                title: '姓名2'
            },{
                field: 'relation',
                title: '关系'
            }]
    });
    $('.bootstrap-table .fixed-table-toolbar').find("button").each(function () {
        $(this).attr('class','btn btn-primary')
    });
}
// 词频统计展示
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

$(document).ready(function(){
    // iCheck初始化 
    $('.i-check').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass:'iradio_square-green'
    })
    
    drawPie([50,30,15,15,20])
    // drawRelationCharts();
    tag_description();
    // relSenTable();
    // wordsCountShow();

    // 使用footable插件,展示词性标注和实体抽取部分
    $('#tag_discription_table').footable();
    $('#entity_extract_table').footable();
});
