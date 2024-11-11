import { useState } from "react";
import ReactApexChart from "react-apexcharts";

const Chart4 = ({ totalHoursOfAttendance = 0 }) => {
    const maxHours = 100; // Assuming 100 hours as max
    const fillColor = totalHoursOfAttendance < 50 ? '#FF0000' : totalHoursOfAttendance < 75 ? '#FFA500' : totalHoursOfAttendance < 100 ? '#4CAF50' : '#0000FF'; // Color based on hours

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
                                    // Update hover data on mouse enter
                                    setHoveredData({
                                        label: 'عدد ساعات الحضور',
                                        percentage: totalHoursOfAttendance,
                                    });
                                },
                            },
                        },
                        labels: ['اجمالي ساعات الحضور'],
                        colors: [fillColor, '#E0E0E0'], // Color for attendance and gray for the empty space
                        dataLabels: {
                            enabled: false, // Disable data labels
                        },
                        tooltip: {
                            custom: function () {
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
                                            formatter: () => hoveredData.label, // Dynamic label
                                        },
                                        value: {
                                            show: true,
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: 'green',
                                            formatter: () => `${totalHoursOfAttendance} H`, // Display total hours
                                        },
                                        total: {
                                            show: true,
                                            label: 'اجمالي ساعات الحضور',
                                            color: fillColor,
                                            formatter: () => `${totalHoursOfAttendance} H`, // Display hours with unit
                                        },
                                    },
                                },
                            },
                        },
                    }}
                    series={[totalHoursOfAttendance, 0]} // Only attendance, no absence
                    type="donut"
                    width={350}
                />
            </div>
            <div className='text-center'>اجمالي ساعات الحضور</div>
        </div>
    );
};

export default Chart4;
