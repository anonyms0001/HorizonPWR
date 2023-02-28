import React from 'react';
import {Line} from 'react-chartjs-2';
import {emit, view} from "../../framework"
import reportStore from "../../stores/reportStore"
// import lineChartStore from "../../stores/lineChartStore"


export default view(function LineChart() {

    const { pointsArray, processedPoint, pointsArrayInit, loadState, lineChartLabels, weeksQuarters, lineChartWeekScores } = reportStore
    // const { } = lineChartStore

    // console.log("LOADSTATE ", loadState)
    // console.log("labels ", lineChartLabels)
    // console.log("weeks scores ", lineChartWeekScores)
    // console.log("processedPoint ", processedPoint)
    // console.log("pointsArray ", pointsArray)



    if (loadState === "loading") {
        let toolTip = document.getElementById("chartjs-tooltip")
        if(toolTip){
            toolTip.parentNode.removeChild(toolTip)
        }
    }
    //simple array
    let weeksScores = []
    let pointsBackground = []
    for (let i = 0; i < lineChartWeekScores.length; i++) {
        // console.log("weeksScores up loop ", lineChartWeekScores[i])
        weeksScores.push(lineChartWeekScores[i])
        if(lineChartWeekScores[i] < 35){
            pointsBackground.push('red')
        }else if(lineChartWeekScores[i] > 75){
            pointsBackground.push('#062d44')
        }else{
            pointsBackground.push('#e79236')
        }

    }
    console.log("weeksScores ", weeksScores)


    const data = {
        labels: lineChartLabels,
        datasets: [
            {
                label: "Weeks Score",
                fillColor: "#ffbc72",
                fontColor: "#fff",
                lineTension: 0,
                // lineTension: 0.1,
                borderColor: '#e79236',
                borderCapStyle: 'butt',
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#e79236',
                pointBackgroundColor: pointsBackground,
                pointBorderWidth: 1,
                pointRadius: pointsArray,

                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#37474F',
                pointHoverBorderColor: '#37474F',
                pointHoverBorderWidth: 2,
                // backgroundColor: "#ffbc72",
                backgroundColor: "#70899f",
                pointHighlightFill: "#ffbc72",
                data: weeksScores,

                // pointHitRadius: 10,

                // data: [20,30,40,50,60],
            }
        ],

    }
    const options = {
        fill: "#ffbc72",
        maintainAspectRatio: false,
        showTooltips: true,
        responsive: true,
        background: "#e79236",
        // elements:{
        //     point:{
        //         radius: ,
        //         display: true,
        // },
        layout: {
            padding: {bottom: -13},
            margin: {bottom: 0},
            fill: "#ffbc72",
            // fill: "#fff3db",
            // margin: {left: '15px', right: '15px'},
            // padding: {left: '15px', right: '15px'}},
        },
        legend: {
            display: false,
            fontColor: "#fff",
        },
        elements: {
            // point: {
            //     radius : function (context){
            //         // console.log(context)
            //         let index = context.dataIndex;
            //         return index === 3 ?
            //             10 :
            //            2;
            //     },
            //     display: true
            // },
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawOnChartArea: false
                    },
                    display: false, // this will hide vertical lines
                    ticks: {
                        reverse: false,
                    },
                    offset: true,
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        drawOnChartArea: false
                    },
                    display: false, // this will hide vertical lines
                    ticks: {
                        max: 130,
                        min: 0
                        // stepSize: 0.5
                    },
                    offset: true,
                },

            ],
        },
        annotations: {
            annotations: [{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 5,
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 4,
                label: {
                    enabled: false,
                    content: 'Test label'
                }
            }]
        },
        // tooltips: {
        //     enabled: true,
        //
        //     custom: function (tooltipModel) {
        //         // console.log(tooltipModel)
        //         // Tooltip Element
        //         let tooltipEl = document.getElementById('chartjs-tooltip')
        //
        //         // Create element on first render
        //         if (!tooltipEl) {
        //             tooltipEl = document.createElement('div')
        //             tooltipEl.id = 'chartjs-tooltip'
        //             tooltipEl.innerHTML = '<table></table>'
        //             document.body.appendChild(tooltipEl)
        //         }
        //         // Hide if no tooltip
        //
        //         // console.log(tooltipModel)
        //
        //         if (tooltipModel.opacity === 0) {
        //             tooltipEl.style.opacity = 1
        //             tooltipEl.style.color = '#000'
        //             return;
        //         }
        //         // else  if (tooltipModel.opacity === 0) {
        //         //     tooltipEl.style.opacity = 1;
        //         //     return;
        //         // }
        //
        //         // Set caret Position
        //         tooltipEl.classList.remove('above', 'below', 'no-transform');
        //         if (tooltipModel.yAlign) {
        //             tooltipEl.classList.add(tooltipModel.yAlign);
        //         } else {
        //             tooltipEl.classList.add('no-transform');
        //         }
        //
        //         function getBody(bodyItem) {
        //             return bodyItem.lines;
        //         }
        //
        //         // Set Text
        //         if (tooltipModel.body) {
        //             let titleLines = tooltipModel.title || []
        //             let bodyLines = tooltipModel.body.map(getBody)
        //
        //             let innerHtml = '<thead>'
        //
        //             titleLines.forEach(function (title) {
        //                 innerHtml += '<tr><th>' + title + '</th></tr>'
        //             });
        //             innerHtml += '</thead><tbody>'
        //
        //             bodyLines.forEach(function (body, i) {
        //                 let colors = tooltipModel.labelColors[i]
        //                 let style = 'background:' + colors.backgroundColor
        //                 style += '; border-color:' + colors.borderColor
        //                 style += '; border-width: 2px'
        //                 let span = '<span style="' + style + '"></span>'
        //                 innerHtml += '<tr><td>' + span + body + '</td></tr>'
        //             });
        //             innerHtml += '</tbody>'
        //
        //             let tableRoot = tooltipEl.querySelector('table')
        //             tableRoot.innerHTML = innerHtml
        //         }
        //
        //         // `this` will be the overall tooltip
        //         let position = this._chart.canvas.getBoundingClientRect()
        //
        //         // Display, position, and set styles for font
        //         tooltipEl.style.opacity = 1
        //         tooltipEl.style.position = 'absolute'
        //         tooltipEl.style.left = position.left + window.pageXOffset - 40 + tooltipModel.caretX + 'px'
        //         tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
        //         // tooltipEl.style.zIndex = 0;
        //         tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
        //         tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
        //         tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
        //         tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
        //         tooltipEl.style.pointerEvents = 'none'
        //         tooltipEl.style.color = '#ffffff00'
        //
        //     }
        // }
    };

    function customRadius( context )
    {
        console.log("CONTEXT ", context)
        // let index = context.dataIndex;
        // return index === 3 ?
        //     10 :
        //     2;
    }


    // CQ.reverse()
    // function selectionIndex(daterange)
    // {
    //     console.log("daterange ", daterange.start, daterange.end)
    //     emit.GetStats({start: daterange.start, end: daterange.end})
    //     emit.GetStatsReport({start: daterange.start, end: daterange.end})
    //     // let toogleDates  = labels.indexOf(index)
    //     // console.log(toogleDates)
    //
    // }


    this.selectionIndex = function (dateRange, positionAtEvent) {
        console.log("daterange ", dateRange.start, dateRange.end, positionAtEvent)

        emit.GetStats({start: dateRange.start, end: dateRange.end})
        emit.GetStatsReport({start: dateRange.start, end: dateRange.end})
        console.log("init pointsArray update  ", pointsArray)
        console.log("EMITTING TO PROCESSS NEW POINT POSITION")
        // emit.PointProcessChange(false)
        emit.ProcessNewPointPosition({position: positionAtEvent, length: (lineChartLabels.length - 1)})


    }


    return (
        <div id="reportChart" className="active" style={{paddingTop: "0px"}}>
            <div style={loadState === "loading" ? {
                background: "#70899f",
                display: "block",
                height: "150px"
            } : {display: "none"}}>
                <div className="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div style={loadState === "loaded" ? {display: "block"} : {display: "none"}}>
                <Line data={data} options={options}
                      getElementAtEvent={elementAtEvent => this.selectionIndex( weeksQuarters[elementAtEvent[0]._index], elementAtEvent[0]._index )}
                />
            </div>
        </div>
    )
})



