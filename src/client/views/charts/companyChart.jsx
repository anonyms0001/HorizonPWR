import React from 'react';
import ReactDOM from 'react-dom';
import {Doughnut} from 'react-chartjs-2';
import {emit, view} from "../../framework";

import weekStatsStore from "../../stores/weekStatsStore";
import salesforceStore from "../../stores/salesforceStore";

export default view(function CompanyChart() {

    const {companyReportScores, companyReportTeamScores} = weekStatsStore
    const {teamState, statesScore, teamScores} = salesforceStore

    // console.log("companyReportScores ", companyReportScores)
    console.log("TEAM SCORES ", teamScores)
    let managerEC = companyReportTeamScores.filter((rep) => {
        return (rep.Name === 'Managers')
    })
    console.log("managerEC HERE6 ", managerEC)

    //company stats
    // let l = 0
    let companyLeads = 0
    let companySits = 0
    let companyCloses = 0
    let companyInstalls = 0

    if (teamState === null || teamState === "Reps") {
        // for (let i = 0; i < statesScore.length; i++) {
        // companyLeads += statesScore[i].Leads
        // companySits += statesScore[i].Qs
        // companyCloses += statesScore[i].Closes
        // companyInstalls += statesScore[i].Installs
        companyLeads = companyReportScores.comLeads
        companySits = companyReportScores.comQs
        companyCloses = companyReportScores.comCloses
        companyInstalls = companyReportScores.comInstalls
        // }
    } else if (teamState === "Idaho") {
        //idaho stats
        companyLeads = statesScore[0].Leads
        companySits = statesScore[0].Qs
        companyCloses = statesScore[0].Closes
        companyInstalls = statesScore[0].Installs
    } else if (teamState === "Oregon") {
        //oregon stats
        companyLeads = statesScore[1].Leads
        companySits = statesScore[1].Qs
        companyCloses = statesScore[1].Closes
        companyInstalls = statesScore[1].Installs
    } else if (teamState === "Boise") {
        companyLeads = teamScores[0].Leads
        companySits = teamScores[0].Qs
        companyCloses = teamScores[0].Closes
        companyInstalls = teamScores[0].Installs
    } else if (teamState === "Klamath Falls") {
        companyLeads = teamScores[1].Leads
        companySits = teamScores[1].Qs
        companyCloses = teamScores[1].Closes
        companyInstalls = teamScores[1].Installs
    } else if (teamState === "Rexburg") {
        companyLeads = teamScores[2].Leads
        companySits = teamScores[2].Qs
        companyCloses = teamScores[2].Closes
        companyInstalls = teamScores[2].Installs
    } else if (teamState === "PWR Dialers") {
        companyLeads = teamScores[3].Leads
        companySits = teamScores[3].Qs
        companyCloses = teamScores[3].Closes
        companyInstalls = teamScores[3].Installs
    } else if (teamState === "Amp") {
        companyLeads = teamScores[4].Leads
        companySits = teamScores[4].Qs
        companyCloses = teamScores[4].Closes
        companyInstalls = teamScores[4].Installs
    } else if (teamState === "Medford") {
        companyLeads = teamScores[5].Leads
        companySits = teamScores[5].Qs
        companyCloses = teamScores[5].Closes
        companyInstalls = teamScores[5].Installs
    } else if (teamState === "Bend") {
        companyLeads = teamScores[6].Leads
        companySits = teamScores[6].Qs
        companyCloses = teamScores[6].Closes
        companyInstalls = teamScores[6].Installs
    } else if (teamState === "Pocatello") {
        companyLeads = teamScores[7].Leads
        companySits = teamScores[7].Qs
        companyCloses = teamScores[7].Closes
        companyInstalls = teamScores[7].Installs
  } else if (teamState === "Twin Falls") {
        companyLeads = teamScores[8].Leads
        companySits = teamScores[8].Qs
        companyCloses = teamScores[8].Closes
        companyInstalls = teamScores[8].Installs
    } else if (teamState === "Meridian") {
        companyLeads = teamScores[10].Leads
        companySits = teamScores[10].Qs
        companyCloses = teamScores[10].Closes
        companyInstalls = teamScores[10].Installs
    } else if (teamState === "Caldwell") {
        companyLeads = teamScores[11].Leads
        companySits = teamScores[11].Qs
        companyCloses = teamScores[11].Closes
        companyInstalls = teamScores[11].Installs
    } else if (teamState === "MIT") {
        companyLeads = teamScores[8].Leads
        companySits = teamScores[8].Qs
        companyCloses = teamScores[8].Closes
        companyInstalls = teamScores[8].Installs
    } else if (teamState === "Managers") {
        if (managerEC.length > 0) {
            companyLeads = managerEC[0].Leads
            companySits = managerEC[0].Sits
            companyCloses = managerEC[0].Closes
            companyInstalls = managerEC[0].ScheduledInstalls
        } else {
            companyLeads = 0
            companySits = 0
            companyCloses = 0
            companyInstalls = 0
        }
    }


    // console.log("COMPANY LEADS ", companyLeads)
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


    //writes in the svg number in the middle
    let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
    Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
        draw: function () {
            originalDoughnutDraw.apply(this, arguments);

            let chart = this.chart;
            let width = chart.chart.width,
                height = chart.chart.height,
                ctx = chart.chart.ctx;

            let fontSize = (height / 40).toFixed(4)
            ctx.font = "bold " + fontSize + "em Montserrat, san-serif"
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
    })


    return (
        <div id="companyChart" className="active">
            <div style={{width: "33.33%", maxHeight: "150px", display: "inline-block", paddingRight: "1.5em"}}>
                <div style={{maxWidth: "150px", margin: "auto"}}>
                    <Doughnut data={companyLeadsChart} width={30} height={30}
                              options={{
                                  cutoutPercentage: 65,
                                  tooltips: {enabled: false},
                                  hover: {mode: null},
                                  layout: {padding: {top: -13}}
                              }}/>
                    <div style={{textAlign: "center"}}>LEADS <br/> <span style={{visibility: "hidden"}}>l</span></div>
                </div>
            </div>
            <div style={{width: "33.33%", maxHeight: "150px", display: "inline-block", paddingRight: "1.5em"}}>
                <div style={{maxWidth: "150px", margin: "auto"}}>
                    <Doughnut data={companySitsChart} width={30} height={30}
                              options={{
                                  cutoutPercentage: 65,
                                  tooltips: {enabled: false},
                                  hover: {mode: null},
                                  layout: {padding: {top: -13}}
                              }}/>
                    <div style={{textAlign: "center"}}>SITS<br/> <span style={{visibility: "hidden"}}>l</span></div>
                </div>
            </div>
            {/*<div style={{width: "25%", display: "inline-block", paddingRight: "1.5em"}}>*/}
            {/*    <Doughnut data={companyClosesChart} width={50} height={50}*/}
            {/*              options={{cutoutPercentage: 65, tooltips: {enabled: false}, hover: {mode: null}, layout: {padding: {top: -13}}}}/>*/}
            {/*    <div style={{textAlign: "center"}}>CLOSES <br/> <span style={{visibility: "hidden"}}>l</span></div>*/}
            {/*</div>*/}
            <div style={{width: "33.33%", maxHeight: "150px", display: "inline-block", paddingRight: "1.5em"}}>
                <div style={{maxWidth: "150px", margin: "auto"}}>
                    <Doughnut data={companyInstallsChart} width={30} height={30}
                              options={{
                                  cutoutPercentage: 65,
                                  tooltips: {enabled: false},
                                  hover: {mode: null},
                                  layout: {padding: {top: -13}}
                              }}/>
                    <div style={{textAlign: "center"}}>INSTALLS<br/> SCHEDULED</div>
                </div>
            </div>
            {/* <div style={{width: "20%", display: "inline-block"}}>
                <Doughnut data={dataBoiseInstalls} width={50} height={50}/>
            //     <div style={{textAlign: "center"}}>BLOODLINE<br/> GROWTH</div>
            // </div>*/}
        </div>
    )
})