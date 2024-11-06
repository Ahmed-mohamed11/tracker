import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart4 = ({ totalHoursOfAttendance = 0 }) => {
    const maxHours = 100; // Assuming 100 hours as max
    const remainingHours = maxHours - totalHoursOfAttendance; // Remaining hours (absence hours)

    // Set color based on the total hours
    const getColorByHours = (hours) => {
        if (hours < 50) return '#FF0000'; // Red for less than 50 hours
        if (hours < 75) return '#FFA500'; // Orange for 50 to 75 hours
        if (hours < 100) return '#4CAF50'; // Green for 75 to 99 hours
        return '#0000FF'; // Blue for 100+ hours
    };

    const fillColor = getColorByHours(totalHoursOfAttendance);

    const [hoveredData, setHoveredData] = useState({
        label: "عدد ساعات الحضور",
        percentage: totalHoursOfAttendance,
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
                                    if (seriesIndex === 1) {
                                        setHoveredData({
                                            label: 'عدد ساعات الغياب',
                                            percentage: remainingHours,
                                        });
                                    } else {
                                        setHoveredData({
                                            label: 'عدد ساعات الحضور',
                                            percentage: totalHoursOfAttendance,
                                        });
                                    }
                                },
                            },
                        },
                        labels: ['اجمالي ساعات الحضور'],
                        colors: [fillColor, '#E0E0E0'], // Dynamic fill color and gray for empty
                        dataLabels: {
                            enabled: true, // Keep this enabled if you still want the data labels, but without percentage
                            style: {
                                fontSize: '18px',
                                fontWeight: 'bold',
                                colors: ['#000'],
                            },
                            formatter: (val) => `${val} H`, // Display value without percentage
                        },
                        tooltip: {
                            custom: function ({ seriesIndex, w }) {
                                // When hovering over the absence part, show absence hours
                                if (seriesIndex === 1) {
                                    return `<div style="padding: 10px; font-size: 18px;">عدد ساعات الغياب: ${remainingHours} H</div>`;
                                }
                                // Otherwise, show attendance hours
                                return `<div style="padding: 10px; font-size: 18px;">عدد ساعات الحضور: ${totalHoursOfAttendance} H</div>`;
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
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: fillColor,
                                            offsetY: -10,
                                            formatter: () => hoveredData.label // Dynamic label based on hover
                                        },
                                        value: {
                                            show: true,
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: 'green',
                                            formatter: () => `${totalHoursOfAttendance} H`, // Display total hours without percentage
                                        },
                                        total: {
                                            show: true,
                                            label: 'اجمالي ساعات الحضور',
                                            color: fillColor,
                                            formatter: () => `${totalHoursOfAttendance} H`, // Display hours with unit
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    series={[totalHoursOfAttendance, remainingHours]} // Filled and remaining hours
                    type="donut"
                    width={350}
                />
            </div>
            <div className='text-center'>اجمالي ساعات الحضور</div>
        </div>
    );
};

export default Chart4;
