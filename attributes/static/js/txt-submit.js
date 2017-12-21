function show_attribute_extract(attributeDict){
    // 属性人名抽取 展示
    namesList = attributeDict.name;
    var row_names = document.getElementById("row_names");
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
    // 实体抽取--地名抽取 展示
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

    // 实体抽取--时间抽取 展示
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
}

function sbt_txt(){
    console.log("####################");
    //variable_init();
    var input_textarea = $("#input_textarea").val();  
    $.ajax({
        type:"get",  //提交方式
        dataType:"text", //数据类型
        url:"/attributes/txt/submit/", //请求url
        data: {
            'input_textarea': input_textarea
        },
        success:function(result){ //提交成功的回调函数
            var ret = eval("("+result+")");
            var paragraphList = ret.text;
            var text = "";
            for (var i = 0; i < paragraphList.length; i++){
                text += paragraphList[i] ;
            }
            $('#passage_txt').html(text);
            var attributes = ret.attributeDict;//属性列表

            {
                // 属性抽取展示
                show_attribute_extract(attributes);
                //属性展示模块，高度设置
                var entieyTable = document.getElementById("entity_extract_table");
                var tableHeight = entieyTable.offsetHeight;
                // document.getElementById("relSen_btBox").style.height = tableHeight + 'px';
                var entityTabBox = document.getElementById("entityTable");
                entityTabBox.style.height =  tableHeight + 90 + "px";
            }
        }
    });
}

