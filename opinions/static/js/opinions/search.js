function getTmpl(tgt){
	return $(tgt).clone().removeAttr("id");
}

function do_search(name, keyword, page) {
    $.ajax({
        type:"post",  //提交方式
        dataType:"text", //数据类型
        url:"/opinions/search/", //请求url
        data: {
			'name': name,
			'keyword': keyword,
            'page': page
        },
        success:function(result){ //提交成功的回调函数
            var ret = eval("("+result+")");

			var hotwords = ret.hotwords;
			var num_result = ret.num_result;
			var opinions = ret.opinions;

            for(i in hotwords){
				w = hotwords[i];

				if( w.indexOf(name) != -1 ){
					continue
				}

				var target = "objective";
				if( w[1] > 10 ){
					target = "positive";
				}
				else if( w[1] < -10 ){
					target = "negative";
				}
				else{
				}

				getTmpl("#template-hotword-" + target).text( w[0] ).attr("href", "?name="+name+"&keyword="+w[0]).appendTo( $("#people-hotwords") )
			}

			$("#num-result").text( num_result );

			for(i in opinions){
				o = opinions[i];

				var ho = getTmpl("#template-opinion")

				$(ho).find(".opinion-news").attr("href", o['href'])
				$(ho).find(".opinion-title").text( o['title'] )
				$(ho).find(".opinion-content").text( o['content'] ).attr("data-oid", o['id'])
				$(ho).find(".opinion-news-link").attr("href", o['href']).text( o['href'].substr(0, 40) + "..." )
				$(ho).find(".opinion-source").text( o['source'] )
				$(ho).find(".opinion-time").text( o['time'] )

				$("#opinions-room").append( ho )
			}
			if( num_result > 0 ){
				pages = []
				pages.push( [1,"<"] );
				for(var i=Math.max(1, page-5); i<Math.min( parseInt(num_result/20), page+5 ); i += 1){
					pages.push( [i,i] )
				}
				pages.push( [parseInt(num_result/20),">"] )
				for(var ii in pages){
					i = pages[ii][0]
					text = pages[ii][1]
					if( text == page ) {  
						text = "<b>"+text+"</b>"
					}
					var p = getTmpl("#template-page-link");
					$(p).find(".page-link").html( text ).attr("title", "第"+i+"页").attr("href", "?name="+name+"&keyword="+keyword+"&page="+i);
					$("#pagination").append(p)
				}
			}
        }
    });
}


function getPar(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return decodeURI(r[2]);  
    return null;  
}  

function search(){
	location.href = "?name="+$("#name-input").val()+"&keyword="+$("#key-input").val();
}

var name = getPar("name")
var keyword = getPar("keyword")
var page = getPar("page")

if( name == null  &&  keyword == null ){
	$("#name-input").val('习近平');
	$("#key-input").val('发展');
}
else{
	$("#name-input").val( name == null ? "" : name )
	$("#key-input").val( keyword == null ? "" : keyword )
}
page = (page == null ? 1 : parseInt(page))
do_search(name, keyword, page)
