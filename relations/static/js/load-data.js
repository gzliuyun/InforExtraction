
// 饼状图的数据
$(function() {

    var data = [{
        label: "名词",
        data: 50,
        color: "#1ab394",
    }, {
        label: "动词",
        data: 30,
        color: "#1c84c6",
    }, {
        label: "形容词",
        data: 15,
        color: "#ed5565",
    },{
        label: "副词",
        data: 15,
        color: "#23c6c8",
    },{
        label: "其它词",
        data: 20,
        color: "#f8ac59",
    }];

    var plotObj = $.plot($("#flot-pie-chart"), data, {
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

});

// 关系力导向图
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
// var ecConfig = require('echarts/config');
// function focus(param) {
//     var data = param.data;
//     var links = option.series[0].links;
//     var nodes = option.series[0].nodes;
//     if (
//         data.source !== undefined
//         && data.target !== undefined
//     ) { //点击的是边
//         var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
//         var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
//         console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
//     } else { // 点击的是点
//         console.log("选中了" + data.name + '(' + data.value + ')');
//     }
// }
// myChart.on(ecConfig.EVENT.CLICK, focus)

// myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
//     console.log(myChart.chart.force.getPosition());
// });