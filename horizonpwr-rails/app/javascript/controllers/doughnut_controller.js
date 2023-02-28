// import {Controller} from 'stimulus';
// import Chart from 'chart.js';
//
// export default class extends Controller {
//     // static targets = ["CanvasTarget" ]
//
//     // Setting controller static values
//     static values = {type: String, data: Object, options: Object}
//
//     connect() {
//         // const element = this.hasCanvasTarget ? this.canvasTarget : this.element;
//         const element = this.element;
//         Chart.pluginService.register({
//             beforeDraw: function (chart) {
//                 var width = chart.chart.width,
//                     height = chart.chart.height,
//                     ctx = chart.chart.ctx,
//                     type = chart.config.type;
//
//                 var percent = Math.round((chart.config.data.datasets[0].data[0] * 100) /
//                     (chart.config.data.datasets[0].data[0] +
//                         chart.config.data.datasets[0].data[1]));
//                 var oldFill = ctx.fillStyle;
//                 var fontSize = ((height - chart.chartArea.top) / 100).toFixed(2);
//
//                 ctx.restore();
//                 ctx.font = "bold " + fontSize + "em sans-serif";
//                 ctx.textBaseline = "middle"
//
//                 var text = percent,
//                     textX = Math.round((width - ctx.measureText(text).width) / 2),
//                     textY = (height + chart.chartArea.top) / 2;
//
//                 // ctx.fillStyle = chart.config.data.datasets[0].backgroundColor[0];
//                 ctx.fillStyle = "#13374e";
//                 ctx.fillText(text, textX, textY);
//                 ctx.fillStyle = oldFill;
//                 ctx.save();
//
//             }
//         });
//
//         this.chart = new Chart(element.getContext('2d'), {
//             type: this.typeValue || 'line',
//             data: this.chartData,
//             options: {
//                 ...this.defaultOptions,
//                 ...this.optionsValue
//             }
//         });
//     }
//
//     get chartData() {
//         if (!this.hasDataValue) {
//             console.warn('[stimulus-chartjs] You need to pass data as JSON to see the chart.');
//         }
//         return this.dataValue;
//     }
//
//     get defaultOptions() {
//         return {};
//     }
//
//
// }