import React from 'react';
import ReactDOM from 'react-dom';
import {Doughnut} from 'react-chartjs-2';
import {emit, view} from "../../framework";

import weekStatsStore from "../../stores/weekStatsStore";

export default view(function BoiseChart() {

    const {weekScores, teamState} = weekStatsStore

    // console.log("TEAM STATE IN BOISE CHART ", teamState);
    // console.log("DOUGH CHART STATS WEEK ", weekScores)


    //boise stats

    let companyLeads = weekScores[0].Leads
    let companySits = weekScores[0].Qs
    let companyCloses = weekScores[0].Closes
    let companyInstalls = weekScores[0].Installs

    let companyLeadsSub = (20 - companyLeads) - companyLeads
    let companySitsSub = (20 - companySits) - companySits
    let companyClosesSub = (20 - companyCloses) - companyCloses
    let companyInstallsSub = (20 - companyInstalls) - companyInstalls
    const companyLeadsChart = {
        datasets: [{
            data: [companyLeads, companyLeadsSub],
            backgroundColor: [
                '#e79236',
                '#e6e6e4',
            ],
            hoverBackgroundColor: [
                '#e79236',
                '#ffffff'
            ]
        }]
    }
    //company sits
    const companySitsChart = {
        datasets: [{
            data: [companySits, companySitsSub],
            backgroundColor: [
                '#e79236',
                '#e6e6e4',
            ],
            hoverBackgroundColor: [
                '#e79236',
                '#ffffff'
            ]
        }]
    }
    //company closes
    const companyClosesChart = {
        datasets: [{
            data: [companyCloses, companyClosesSub],
            backgroundColor: [
                '#e79236',
                '#e6e6e4',
            ],
            hoverBackgroundColor: [
                '#e79236',
                '#ffffff'
            ]
        }]
    }
    //company installs
    const companyInstallsChart = {
        datasets: [{
            data: [companyInstalls, companyInstallsSub],
            backgroundColor: [
                '#e79236',
                '#e6e6e4',
            ],
            hoverBackgroundColor: [
                '#e79236',
                '#ffffff'
            ]
        }]
    }


    let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
        draw: function () {
            originalDoughnutDraw.apply(this, arguments);

            let chart = this.chart;
            let width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;

            let fontSize = (height / 60).toFixed(3);
            ctx.font = fontSize + "em sans-serif";
            ctx.textColor = "#ffffff";
            ctx.textBaseline = "middle";

            let sum = 0;
            for (let i = 0; i < chart.config.data.datasets[0].data.length; i++) {
                sum += chart.config.data.datasets[0].data[i];
                // console.log(sum)
            }


            let text = 20 - sum,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;

            ctx.fillText(text, textX, textY);
        }
    });


    return (
        <div id="boiseChart" className={teamState === "Boise" ? "active" : "inactive"} >
            
            <div style={{width: "20%", display: "inline-block"}}>
                <Doughnut data={companyLeadsChart} width={50} height={50}
                          options={{tooltips: {enabled: false}, hover: {mode: null}}}/>
                <div style={{textAlign: "center"}}>LEADS <br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "20%", display: "inline-block"}}>
                <Doughnut data={companySitsChart} width={50} height={50}
                          options={{tooltips: {enabled: false}, hover: {mode: null}}}/>
                <div style={{textAlign: "center"}}>SITS<br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "20%", display: "inline-block"}}>
                <Doughnut data={companyClosesChart} width={50} height={50}
                          options={{tooltips: {enabled: false}, hover: {mode: null}}}/>
                <div style={{textAlign: "center"}}>CLOSES <br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "20%", display: "inline-block"}}>
                <Doughnut data={companyInstallsChart} width={50} height={50}
                          options={{tooltips: {enabled: false}, hover: {mode: null}}}/>
                <div style={{textAlign: "center"}}>INSTALLS<br/> SCHEDULED</div>
            </div>

            <div style={{width: "20%", display: "inline-block"}}>
                {/*<Doughnut data={dataBoiseInstalls} width={50} height={50}/>*/}
                <div style={{textAlign: "center"}}>BLOODLINE<br/> GROWTH</div>
            </div>
        </div>
    )
})