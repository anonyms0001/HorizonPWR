import React from 'react';
import ReactDOM from 'react-dom';
import {Doughnut} from 'react-chartjs-2';
import {emit, view} from "../framework";
import teamStatsStore from "../stores/teamStatsStore";

const { teamScoresTeam } = teamStatsStore

console.log("FROM CHART team scores ",teamScoresTeam);

let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function() {
        originalDoughnutDraw.apply(this, arguments);

        let chart = this.chart;
        let width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

        let fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        let sum = 0;
        for (let i = 0; i < chart.config.data.datasets[0].data.length; i++) {
            sum += chart.config.data.datasets[0].data[i];
        }

        let text = sum,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillText(text, textX, textY);
    }
});
 // let rexleads = teamScoresTeam[0].Leads - 100;
 //    console.log(rexleads);
const data = {
    // labels: [
    //     'Red',
    //     'Green',
    //     'Yellow'
    // ],

    datasets: [{
        data: [80, 30],
        // data: [teamScoresTeam[0].Leads, rexleads],
        // borderColor: '#000000',
        backgroundColor: [
            '#e79236',
            '#e6e6e4',
            // '#FFCE56'
        ],
        hoverBackgroundColor: [
            '#e79236',
            '#ffffff',
            // '#FFCE56'
        ]
    }]
}

// export default React.createClass({
// export default React.createClass({
//     displayName: 'DoughnutExample',
export default function DoughnutChart(){
    // render() {
        return (
            <div>

                <Doughnut data={data} width={50} height={50}  />
                <div>Doughnut Chart</div>
            </div>
        )
    // }
}
