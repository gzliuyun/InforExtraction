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
