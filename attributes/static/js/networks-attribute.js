//$(function() {
//
//    // 加载进来时，先绘制json文件中的人物关系
////    d3.json("../../static/json/relation.json",function(error,root){
////        if( error ){
////            return console.log(error);
////        }
////        drawNetwork(root);
////    });
//    // search提交ajax
//    $("#search_people").submit(function(){
//        var search_name = $("#search_peoplename").val();
//        console.log(search_name)
//        $.ajax({
//            type:"get",  //提交方式
//            dataType:"text", //数据类型
//            url:"/attributes/peoplesearch/", //请求url
//            data: {
//                'search_name': search_name
//            },
//            success:function(jsonData){ //提交成功的回调函数
//                var networkData = eval("("+jsonData+")");
//                //drawNetwork(networkData);
//                console.log(networkData);
//                document.append(networkData);
//            }
//        });
//        return false; //不刷新页面
//    });
//});

function sbt_people(){
    var search_name = $("#search_peoplename").val();
        console.log(search_name);
        $.ajax({
            type:"get",  //提交方式
            dataType:"text", //数据类型
            url:"/attributes/network/search/", //请求url
            data: {
                'search_name': search_name
            },
            success:function(jsonData){ //提交成功的回调函数
                var ret = eval("("+jsonData+")");

                document.getElementById("person_intro").innerHTML="";
                document.getElementById("person_attributes").innerHTML="";

                var attributes = ret.attributes;
                var information = ret.information;
                console.log(attributes);
                console.log(typeof attributes);
                console.log(typeof information);

                //展示人物简介部分
                var intro_div = document.getElementById("person_intro");
//                var text = document.createTextNode(information['简介']);
//                intro_p.appendChild(text);


//                var intro_p = document.createElement("p");
//                var text = document.createTextNode(information['简介']);
//                intro_p.appendChild(text);
                //设置textarea的相应属性值
                var intro_textarea = document.createElement("textarea");
                intro_textarea.value = information['简介'];
                intro_textarea.rows = "30";
                intro_textarea.cols = "110";
                intro_div.appendChild(intro_textarea);
                //展示人物属性信息

                var attributes_ul = document.getElementById("person_attributes");
                for(var attr in attributes){
                    var attr_li = document.createElement("li");
                    attr_li.setAttribute("id","attribute_info");
                    attr_li.style.listStyle = "none";
                    attr_li.innerHTML = attr + " : " + attributes[attr];

                    //attr_li.style.fontWeight = "bold";
                    attributes_ul.appendChild(attr_li);
                }

                //展示图片
                var photo = document.getElementById("photo_url");
                photo.src = information['photo_url'];
                photo.style.width = "27";
                photo.style.height = "50";
            }
        });
        return false; //不刷新页面
}
function drawNetwork(networkData){
    var width = 900;
    var height = 600;
    var img_w = 77;
    var img_h = 90;
    var radius = 35;    //圆形半径

    document.getElementById('network').innerHTML = "";
    var svg = d3.select("#network").append("svg")
                            .attr("width",width)
                            .attr("height",height);

    // ../../static/json/relation.json
    var root = networkData;
    // d3.json("../../static/json/relation.json",function(error,root){

        // if( error ){
        //     return console.log(error);
        // }
        console.log(root);

        //D3力导向布局
        var force = d3.layout.force()
                        .nodes(root.nodes)
                        .links(root.edges)
                        .size([width,height])
                        .linkDistance(200)
                        .charge(-1500)
                        .start();

        //边             
        var edges_line = svg.selectAll("line")
                            .data(root.edges)
                            .enter()
                            .append("line")
                            .style("stroke","#ccc")
                            .style("stroke-width",1);

        //边上的文字（人物之间的关系）            
        var edges_text = svg.selectAll(".linetext")
                            .data(root.edges)
                            .enter()
                            .append("text")
                            .attr("class","linetext")
                            .text(function(d){
                                return d.relation;
                            });


        // 圆形图片节点（人物头像）
        var nodes_img = svg.selectAll("image")
                            .data(root.nodes)
                            .enter()
                            .append("circle")
                            .attr("class", "circleImg")
                            .attr("r", radius)
                            .attr("fill", function(d, i){

                                //创建圆形图片
                                var defs = svg.append("defs").attr("id", "imgdefs")

                                var catpattern = defs.append("pattern")
                                                        .attr("id", "catpattern" + i)
                                                        .attr("height", 1)
                                                        .attr("width", 1)

                                catpattern.append("image")
                                        .attr("x", - (img_w / 2 - radius))
                                        .attr("y", - (img_h / 2 - radius))
                                        .attr("width", img_w)
                                        .attr("height", img_h)
                                        .attr("xlink:href", d.image)

                                return "url(#catpattern" + i + ")";

                            })
                            .on("mouseover",function(d,i){
                                //显示连接线上的文字
                                edges_text.style("fill-opacity",function(edge){
                                    if( edge.source === d || edge.target === d ){
                                        return 1.0;
                                    }
                                });
                            })
                            .on("mouseout",function(d,i){
                                //隐去连接线上的文字
                                edges_text.style("fill-opacity",function(edge){
                                    if( edge.source === d || edge.target === d ){
                                        return 0.0;
                                    }
                                });
                            })
                            .call(force.drag);


        var text_dx = -20;
        var text_dy = 20;

        var nodes_text = svg.selectAll(".nodetext")
                            .data(root.nodes)
                            .enter()
                            .append("text")
                            .attr("class","nodetext")
                            .attr("dx",text_dx)
                            .attr("dy",text_dy)
                            .text(function(d){
                                return d.name;
                            });


        force.on("tick", function(){

            //限制结点的边界
            root.nodes.forEach(function(d,i){
                d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
                d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
                d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
                d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
            });

            //更新连接线的位置
             edges_line.attr("x1",function(d){ return d.source.x; });
             edges_line.attr("y1",function(d){ return d.source.y; });
             edges_line.attr("x2",function(d){ return d.target.x; });
             edges_line.attr("y2",function(d){ return d.target.y; });

             //更新连接线上文字的位置
             edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
             edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });


             //更新结点图片和文字
             nodes_img.attr("cx",function(d){ return d.x });
             nodes_img.attr("cy",function(d){ return d.y });

             nodes_text.attr("x",function(d){ return d.x });
             nodes_text.attr("y",function(d){ return d.y + img_w/2; });
        });
    // });
}
