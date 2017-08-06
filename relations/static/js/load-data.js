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
        [{"num":"1","abbr":"CC","chn":"连接词","en":"Coordinating conjunction"},
        {"num":"2","abbr":"CD","chn":"基数词","en":"Cardinal number"},
        {"num":"3","abbr":"DT","chn":"限定词","en":"Determiner"},
        {"num":"4","abbr":"EX","chn":"存在句","en":"Existential there"},
        {"num":"5","abbr":"FW","chn":"外来词","en":"Foreign word"},
        {"num":"6","abbr":"IN","chn":"介词或从属连词","en":"Preposition or subordinating conjunction"},
        {"num":"7","abbr":"JJ","chn":"形容词或序数词","en":"Adjective"},
        {"num":"8","abbr":"JJR","chn":"形容词比较级","en":"Adjective,comparative"},
        {"num":"9","abbr":"JJS","chn":"形容词最高级","en":"Adjective,superlative"},
        {"num":"10","abbr":"LS","chn":"列表标示","en":"List item marker"},
        {"num":"11","abbr":"MD","chn":"情态助动词","en":"Modal"},
        {"num":"12","abbr":"NN","chn":"常用名词(单数)","en":"Noun,singular or mass"},
        {"num":"13","abbr":"NNS","chn":"常用名词(复数)","en":"Noun,plural"},
        {"num":"14","abbr":"NNP","chn":"专有名词(单数)","en":"Proper noun,singular"},
        {"num":"15","abbr":"NNPS","chn":"专有名词(复数)","en":"Proper noun,plural"},
        {"num":"16","abbr":"PDT","chn":"前位限定词","en":"Predeterminer"},
        {"num":"17","abbr":"POS","chn":"所有格结束词","en":"Possessive ending"},
        {"num":"18","abbr":"PRP","chn":"人称代词","en":"Personal pronoun"},
        {"num":"19","abbr":"PRP$","chn":"所有格代名词","en":"Possessive pronoun"},
        {"num":"20","abbr":"RB","chn":"副词","en":"Adverb"},
        {"num":"21","abbr":"RBR","chn":"副词比较级","en":"Adverb,comparative"},
        {"num":"22","abbr":"RBS","chn":"副词最高级","en":"Adverb,superlative"},
        {"num":"23","abbr":"RP","chn":"小品词","en":"Particle"},
        {"num":"24","abbr":"SYM","chn":"符号","en":"Symbol"},
        {"num":"25","abbr":"TO","chn":"介词或不定式格式","en":"to"},
        {"num":"26","abbr":"UH","chn":"感叹词","en":"Interjection"},
        {"num":"27","abbr":"VB","chn":"动词基本形式","en":"Verb,base"},
        {"num":"28","abbr":"VBD","chn":"动词过去式","en":"Verb,past"},
        {"num":"29","abbr":"VBG","chn":"动名词和现在分词","en":"Verb,gerund"},
        {"num":"30","abbr":"VBN","chn":"过去分词","en":"Verb,past"},
        {"num":"31","abbr":"VBP","chn":"动词非第三人称单数","en":"Verb,non-3rd"},
        {"num":"32","abbr":"VBZ","chn":"动词第三人称单数","en":"Verb,3rd"},
        {"num":"33","abbr":"WDT","chn":"限定词","en":"Wh-determiner"},
        {"num":"34","abbr":"WP","chn":"代词","en":"Wh-pronoun"},
        {"num":"35","abbr":"WP$","chn":"所有格代词","en":"Possessive wh-pronoun"},
        {"num":"36","abbr":"WRB","chn":"疑问代词","en":"Wh-adverb"}];
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
