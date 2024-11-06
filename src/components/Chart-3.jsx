

import { t } from "i18next";
import ReactApexChart from "react-apexcharts";
import React, { useState } from "react";

const Chart3 = ({ totalHoursOfAttendance, totalAttendancePercentage }) => {
    const fillPercentage = totalAttendancePercentage;
    const absencePercentage = 100 - fillPercentage; // Calculate absence percentage

    const getColorByPercentage = (percentage) => {
        if (percentage < 50) return '#FF0000'; // Red for < 50%
        if (percentage < 75) return '#FFA500'; // Orange for 50% to 75%
        if (percentage < 100) return '#4CAF50'; // Green for 75% to 99%
        return '#0000FF'; // Blue for 100%
    };

    const fillColor = getColorByPercentage(fillPercentage);

    // State to hold the label and percentage based on hover
    const [hoveredData, setHoveredData] = useState({
        label: 'اجمالي نسبه الحضور',
        percentage: fillPercentage
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={{
                        chart: {
                            width: 380,
                            type: 'donut',
                            events: {
                                dataPointMouseEnter: (event, chartContext, { seriesIndex }) => {
                                    // Set hover data based on the section hovered
                                    setHoveredData({
                                        label: seriesIndex === 0 ? 'اجمالي نسبه الحضور' : 'نسبة الغياب',
                                        percentage: seriesIndex === 0 ? fillPercentage : absencePercentage
                                    });
                                },
                                dataPointMouseLeave: () => {
                                    // Reset to default when not hovering
                                    setHoveredData({
                                        label: 'اجمالي نسبه الحضور',
                                        percentage: fillPercentage
                                    });
                                }
                            }
                        },
                        labels: ['اجمالي نسبه الحضور', 'نسبة الغياب'], // Labels for both parts
                        colors: [fillColor, 'black'], // Dynamic color and gray for remainder
                        dataLabels: {
                            enabled: true,
                            dropShadow: { enabled: false },
                            style: {
                                fontSize: '20px',
                                fontWeight: 'bold',
                                colors: ['black'], // Ensures the label text is visible
                            },
                        },
                        legend: {
                            show: false,
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    labels: {
                                        show: true,
                                        name: {
                                            show: true,
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: fillColor,
                                            offsetY: -10,
                                            formatter: () => hoveredData.label // Dynamic label based on hover
                                        },
                                        value: {
                                            show: true,
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: 'green',
                                            formatter: () => `${hoveredData.percentage}%`, // Dynamic percentage based on hover
                                        },
                                        total: {
                                            show: true,
                                            label: hoveredData.label,
                                            color: fillColor,
                                            formatter: () => `${hoveredData.percentage}%`, // Dynamic center value
                                        },
                                    }
                                }
                            }
                        },
                    }}
                    series={[fillPercentage, absencePercentage]} // Filled and remaining parts
                    type="donut"
                    width={350}
                />
            </div>
            <div className="text-center">اجمالي نسبه الحضور</div>
        </div>
    );
};


export default Chart3;
