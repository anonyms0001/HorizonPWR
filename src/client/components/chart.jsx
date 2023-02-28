import React, {useEffect, useRef} from "react";
import Chart from "chart.js";
// import { useSelector } from "react-redux";
// import { metronic } from "../../_metronic";

export default function QuickStatsChart({
                                            value,
                                            desc,

                                            // array of numbers
                                            data,
                                            // chart line color
                                            color,
                                            // chart line size
                                            border
                                        }) {
    const canvasRef = useRef();
    // const {pointHoverBackgroundColor} = useSelector(state => ({
    //     pointHoverBackgroundColor: metronic.builder.selectors.getConfig(
    //         state,
    //         "colors.state.danger"
    //     )
    // }));

    useEffect(() => {
        const config = {
            type: "doughnut",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October"
                ],
                datasets: [
                    {
                        label: "",
                        borderColor: color,
                        borderWidth: border,



                        pointBackgroundColor: Chart.helpers
                            .color("#e79236")
                            .alpha(0)
                            .rgbString(),
                        pointBorderColor: Chart.helpers
                            .color("#000000")
                            .alpha(0)
                            .rgbString(),


                        fill: false,
                        data: data
                    }
                ]
            },
            options: {
                title: {
                    display: false
                },
                tooltips: {
                    enabled: false,
                    intersect: false,
                    mode: "nearest",
                    xPadding: 10,
                    yPadding: 10,
                    caretPadding: 10
                },
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: false
                    }
                },
                responsive: true,
                maintainAspectRatio: true,
                hover: {
                    mode: "ErrorsPage.js"
                },
                scales: {
                    xAxes: [
                        {
                            display: false,
                            gridLines: false,
                            scaleLabel: {
                                display: true,
                                labelString: "Month"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            gridLines: false,
                            scaleLabel: {
                                display: true,
                                labelString: "Value"
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                },

                elements: {
                    point: {
                        radius: 4,
                        borderWidth: 12
                    }
                },

                layout: {
                    padding: {
                        left: 0,
                        right: 10,
                        top: 5,
                        bottom: 0
                    }
                }
            }
        };

        const chart = new Chart(canvasRef.current, config);

        return () => {
            chart.destroy();
        };
    }, [data, color, border]);

    return (
        <div className="kt-widget26" style={{flex:1}}>
            <div className="kt-widget26__content"  style={{flex:1}}>
                <span className="kt-widget26__number">{value}</span>
                <span className="kt-widget26__desc">{desc}</span>
            </div>

            <div
                className="kt-widget26__chart"
                style={{flex:1}}
            >
                <canvas ref={canvasRef} id="kt_chart_quick_stats_1"/>
            </div>
        </div>
    )
}
