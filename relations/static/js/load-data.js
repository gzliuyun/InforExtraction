// $(document).ready(function(){

//     // $('input').iCheck('uncheck')
// });

function drawPie(tagsNum){
    // var wordsInfo = [{
    //     label: "名词",
    //     data: tagsNum[0],
    //     color: "#1ab394",
    // }, {
    //     label: "动词",
    //     data: tagsNum[1],
    //     color: "#1c84c6",
    // }, {
    //     label: "形容词",
    //     data: tagsNum[2],
    //     color: "#ed5565",
    // },{
    //     label: "副词",
    //     data: tagsNum[3],
    //     color: "#23c6c8",
    // },{
    //     label: "其它词",
    //     data: tagsNum[4],
    //     color: "#f8ac59",
    // }];
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
function drawRelationCharts(){
    var relationDiv = document.getElementById('relation_panel')
    var relationChart = echarts.init(relationDiv);
    relationOption = {
        title : {
            text: '人物关系：乔布斯',
            subtext: '数据来自人立方',
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
        legend: {
            x: 'left',
            data:['家人','朋友']
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
                    },
                    {
                        name: '家人'
                    },
                    {
                        name:'朋友'
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
                nodes:[
                    {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
                    {category:1, name: '丽萨-乔布斯',value : 2},
                    {category:1, name: '保罗-乔布斯',value : 3},
                    {category:1, name: '克拉拉-乔布斯',value : 3},
                    {category:1, name: '劳伦-鲍威尔',value : 7},
                    {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
                    {category:2, name: '奥巴马',value : 8},
                    {category:2, name: '比尔-盖茨',value : 9},
                    {category:2, name: '乔纳森-艾夫',value : 4},
                    {category:2, name: '蒂姆-库克',value : 4},
                    {category:2, name: '龙-韦恩',value : 1},
                ],
                links : [
                    {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
                    {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
                    {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
                    {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
                    {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
                    {source : '奥巴马', target : '乔布斯', weight : 1},
                    {source : '比尔-盖茨', target : '乔布斯', weight : 6, name: '竞争对手'},
                    {source : '乔纳森-艾夫', target : '乔布斯', weight : 1, name: '爱将'},
                    {source : '蒂姆-库克', target : '乔布斯', weight : 1},
                    {source : '龙-韦恩', target : '乔布斯', weight : 1},
                    {source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '保罗-乔布斯', weight : 1},
                    {source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
                    {source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
                    {source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
                    {source : '比尔-盖茨', target : '奥巴马', weight : 6},
                    {source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
                    {source : '蒂姆-库克', target : '奥巴马', weight : 1}
                ]
            }
        ]
    };
    relationChart.setOption(relationOption);
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

drawPie([50,30,15,15,20])
drawRelationCharts();
tag_description();
// 使用footable插件
$('#tag_discription_table').footable();
$('#entity_extract_table').footable();
