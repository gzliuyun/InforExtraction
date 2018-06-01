
function show_ages_list(data1, data2){
                   var barChart = echarts.init(document.getElementById("echarts-bar-chart"));
    var baroption = {
        title : {
            text: '人物出生年代分布'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['19世纪','20世纪']
        },
        grid:{
            x:30,
            x2:40,
            y2:24
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['10','20','30','40','50','60','70','80','90','100']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'19世纪',
                type:'bar',
                data: data1,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'20世纪',
                type:'bar',
                data:data2,
                markPoint : {
                    data : [
                        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    };
    barChart.setOption(baroption);

    window.onresize = barChart.resize;
}


function show_bar_list(title, view, data1, data2){
    var barChart = echarts.init(document.getElementById(view));
  var baroption = {
        title : {
            text: title
        },
        tooltip : {
            trigger: 'axis'
        },
       
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['即时新闻','评论声音','中国时报','工商时报','环球时报','国际新闻','要闻']
            }
        ],
        yAxis : [
            {
                type : 'value',
				name : '数量(k)'
            }
        ],
        series : [
            {
                type:'bar',
                data:data2,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    barChart.setOption(baroption);

    window.onresize = barChart.resize;
}






function show_pie_list(title, view, data1, data2, per) {
     var pieChart = echarts.init(document.getElementById(view));
    var pieoption = {
        title : {
            text: title,
            subtext: '占总体的'+per,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:data1
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: data2
                /*[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ]
                */
            }
        ]
    };
    pieChart.setOption(pieoption);
    $(window).resize(pieChart.resize);
}






function home_txt() {
    console.log("*####################*");
    //var input_textarea = $("#input_textarea").val();  
	//var input_s = 2;
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/home/txt/submit/", //请求url
        data: {
          //  'people_num':'2'
        },

        success:function(result){ //提交成功的回调函数
			console.log("hello");
            var ret = eval("("+result+")");
            var peopleNum = ret.peopleNum;
			var relationNum = ret.relationNum;
            var relationTypeNum = ret.relationTypeNum;
            var newsNum = ret.newsNum;
            var opinionsNum = ret.opinionsNum;
            $("#people-num").text(peopleNum);
			$("#relation-num").text(relationNum);
            //$("#relation-type-num").text(relationTypeNum);
            $("#news-num").text(newsNum);
            $("#opinion-num").text(opinionsNum);


            var ages19List = ret.ages19List;
            var ages20List = ret.ages20List;
            show_ages_list(ages19List,ages20List);

            var relationListTitle = ret.relationListTitle;
            var relationList = ret.relationList;
            var relationListPer = ret.relationListPer;
            show_pie_list('最常出现的6种关系',"echarts-pie-chart",relationListTitle,relationList, relationListPer);

      }
    });
}

function home_source_txt() {
    console.log("####################");
    //var input_textarea = $("#input_textarea").val();  
    //var input_s = 2;
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/home/txt/source/", //请求url
        data: {
          //  'people_num':'2'
        },

        success:function(result){ //提交成功的回调函数
            console.log("hello");
            var ret = eval("("+result+")");
           
            var sourceListTitle = ret.sourceListTitle;
            var sourceList = ret.sourceList;
            show_pie_list('新闻最多的6个来源',"echarts-pie-source",sourceListTitle,sourceList, "0.80");

      }
    });
}

function home_classify_txt() {
    console.log("####################");
    //var input_textarea = $("#input_textarea").val();  
    //var input_s = 2;
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/home/txt/classify/", //请求url
        data: {
          //  'people_num':'2'
        },

        success:function(result){ //提交成功的回调函数
            console.log("hello");
            var ret = eval("("+result+")");
            var classifyListTitle = ret.classifyListTitle;
            var classifyList = ret.classifyList;
            show_bar_list("新闻类别","echarts-bar-classify", classifyListTitle, classifyList);

      }
    });
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
            pageList: [7],
            pageSize:"7",
            columns: [{
                field: 'ids',
                title: '序号'
            }, {
                field: 'name',
                title: '名字'
            }, {
                field: 'number',
                title: '观点数'
            }, {
                field: 'hotwords',
                title: '观点领域'
            }]
    });
    $('.bootstrap-table .fixed-table-toolbar').find("button").each(function () {
        $(this).attr('class','btn btn-primary')
    });
}


function home_opinions_txt() {
    console.log("####################");
    //var input_textarea = $("#input_textarea").val();  
    //var input_s = 2;
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/home/txt/opinions/", //请求url
        data: {
          //  'people_num':'2'
        },

        success:function(result){ //提交成功的回调函数
            console.log("hello");
            var ret = eval("("+result+")");
            var opinionsListTitle = ret.opinionsListTitle;
            var opinionsList = ret.opinionsList;
            show_pie_list('观点最多的6个人',"echarts-pie-opinions",opinionsListTitle,opinionsList, "0.28");
      
            var relTableData = ret.opinionsTable;

            if (relTableData.length > 0){
                relSenTable(relTableData);
                // 高度设置
                var btTable = document.getElementById("relation_sentence_table");
                var tableHeight = btTable.offsetHeight;
                var relTabBox = document.getElementById("relSen_btBox");
                relTabBox.style.height =  tableHeight + 100 + "px";
            }else{
                
                relSenTable([]);
                var relTabBox = document.getElementById("relSen_btBox");
                relTabBox.style.height =  200 + "px";
            }

      }
    });
}
