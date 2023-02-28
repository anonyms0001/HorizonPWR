import React from 'react';
import ReactDOM from 'react-dom';
import {Doughnut} from 'react-chartjs-2';
import {emit, view} from "../../framework";

import weekStatsStore from "../../stores/weekStatsStore";
import salesforceStore from "../../stores/salesforceStore";

export default view(function IdahoChart() {

    const {weekScores} = weekStatsStore
    const { teamState,  statesScore} = salesforceStore

    // console.log("TEAM STATE IN IDAHO CHART ", statesScore);
    // console.log("DOUGH CHART STATS WEEK ", weekScores)


    //idaho stats

   let companyLeads = statesScore[0].Leads
    let companySits = statesScore[0].Qs
    let companyCloses = statesScore[0].Closes
    let companyInstalls = statesScore[0].Installs


    // for (let i = 0; i < weekScores.length; i++) {
    //     if(weekScores[i].Team === "Rexburg" || weekScores[i].Team === "Boise"){
    //         companyLeads += weekScores[i].Leads
    //         companySits += weekScores[i].Qs
    //         companyCloses += weekScores[i].Closes
    //         companyInstalls += weekScores[i].Installs
    //     }
    // }

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

            let fontSize = (height / 40).toFixed(4);
            ctx.font = "bold " + fontSize + "em Montserrat, san-serif";
            // ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#13374e";

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
        <div id="idahoChart" className={teamState === "Idaho" ? "active" : "inactive"} >
            {/*<h4 style={{textAlign: "center"}}>BOISE </h4>*/}
            <div style={{width: "25%", display: "inline-block", paddingRight: "1.5em"}}>
                <Doughnut data={companyLeadsChart} width={50} height={50}
                          options={{cutoutPercentage: 65, tooltips: {enabled: false}, hover: {mode: null}, layout: {padding: {top: -13}}}}/>
                <div style={{textAlign: "center"}}>LEADS <br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "25%", display: "inline-block", paddingRight: "1.5em"}}>
                <Doughnut data={companySitsChart} width={50} height={50}
                          options={{cutoutPercentage: 65, tooltips: {enabled: false}, hover: {mode: null}, layout: {padding: {top: -13}}}}/>
                <div style={{textAlign: "center"}}>SITS<br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "25%", display: "inline-block", paddingRight: "1.5em"}}>
                <Doughnut data={companyClosesChart} width={50} height={50}
                          options={{cutoutPercentage: 65, tooltips: {enabled: false}, hover: {mode: null}, layout: {padding: {top: -13}}}}/>
                <div style={{textAlign: "center"}}>CLOSES <br/> <span style={{visibility: "hidden"}}>l</span></div>
            </div>

            <div style={{width: "25%", display: "inline-block", paddingRight: "1.5em"}}>
                <Doughnut data={companyInstallsChart} width={50} height={50}
                          options={{ tooltips: {enabled: false}, hover: {mode: null}, layout: {padding: {top: -13}}}}/>
                <div style={{textAlign: "center"}}>INSTALLS<br/> SCHEDULED</div>
            </div>

        
        </div>
    )
})