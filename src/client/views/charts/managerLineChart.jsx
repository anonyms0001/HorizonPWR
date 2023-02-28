import React from 'react';
import {Line} from 'react-chartjs-2';
import {emit, view} from "../../framework"
import weeklyReportStore from "../../stores/weeklyReportStore"
import sessionStore from "../../stores/sessionStore"
import userStore from "../../stores/userStore";

export default view(function ManagerLineChart() {

    const {topLabel, teamsWeekScores, pointsArray, weeksQuarters} = weeklyReportStore
    const {user} = sessionStore
    console.log("teamsWeekScores manger line chart ", teamsWeekScores)
    // let teamChartNumbers = JSON.parse(weekReport.team_numbers)

    // console.log("teamNumbers MANAGER ", teamChartNumbers)

    let teamFromSession = user.teamName === "Klamath Falls" ? "Fox" : user.teamName
    console.log("teamFromSession ", teamFromSession)
    let currentTeam = teamsWeekScores[teamFromSession]
    let weeksScores = []

    // console.log("currentTeam MANAGer reVERSE ", currentTeam)

    let pointsBackground = []
    for (let i = 0; i < currentTeam.length; i++) {
        // console.log("weeksScores up loop ", lineChartWeekScores[i])
        weeksScores.push(currentTeam[i])
        if (currentTeam[i] < 35) {
            pointsBackground.push('red')
        } else if (currentTeam[i] > 75) {
            pointsBackground.push('#062d44')
        } else {
            pointsBackground.push('#e79236')
        }

    }
    // console.log("weeksScores ", weeksScores)
    weeksScores.reverse()
    pointsBackground.reverse()

    const data = {
        labels: topLabel,
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
                // pointBackgroundColor: '#e79236',
                pointBorderWidth: 1,
                pointRadius: pointsArray,
                // pointRadius: 1,

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
    };




    this.selectionIndex = function (dateRange, positionAtEvent) {
        console.log("daterange ", dateRange.start, dateRange.end, positionAtEvent)

        // emit.GetStats({start: dateRange.start, end: dateRange.end})
        emit.GetWeeksReport({start: dateRange.start, end: dateRange.end})
        // console.log("init pointsArray update  ", pointsArray)
        console.log("EMITTING TO PROCESSS NEW POINT POSITION")
        // emit.PointProcessChange(false)
        // console.log("ProcessNewPointPosition ", positionAtEvent, bottomLabel.length)
        emit.ProcessNewPointPosition({position: positionAtEvent, length: (weeksScores.length - 1)})


    }


    return (
        <div id="reportChart" className="active" style={{paddingTop: "0px"}}>

            <div>
                <Line data={data} options={options}
                      getElementAtEvent={elementAtEvent => this.selectionIndex(weeksQuarters[elementAtEvent[0]._index], elementAtEvent[0]._index)}
                />
            </div>
        </div>
    )
})



