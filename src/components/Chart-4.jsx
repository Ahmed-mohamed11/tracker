import ReactApexChart from "react-apexcharts";

const Chart4 = ({ totalHoursOfAttendance = 0, totalAttendancePercentage = 0 }) => {
    const fillPercentage = totalHoursOfAttendance > 100 ? 100 : totalHoursOfAttendance;

    // Set color based on the fillPercentage
    const getColorByPercentage = (percentage) => {
        if (percentage < 50) return '#FF0000'; // Red for less than 50%
        if (percentage < 75) return '#FFA500'; // Orange for 50% to 75%
        if (percentage < 100) return '#4CAF50'; // Green for 75% to 99%
        return '#0000FF'; // Blue for 100%
    };

    const fillColor = getColorByPercentage(fillPercentage);

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={{
                        chart: {
                            width: 380,
                            type: 'donut',
                        },
                        labels: ['اجمالي ساعات الحضور'],
                        colors: [fillColor, '#E0E0E0'], // Dynamic fill color and gray for empty
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontSize: '18px',
                                fontWeight: 'bold',
                                colors: ['#000'],
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
                                            color: fillColor, // Color for the label
                                            offsetY: -10,
                                        },
                                        value: {
                                            show: false,
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: 'green',
                                            formatter: () => `${totalHoursOfAttendance || 0}`, // Show total hours directly
                                        },
                                        total: {
                                            show: false,
                                            label: 'اجمالي ساعات الحضور',
                                            color: fillColor, // Color for the total label
                                            formatter: () => `${totalHoursOfAttendance}%`,
                                        }
                                    }
                                }
                            }
                        }
                    }}
                    series={[fillPercentage || 0, 100 - fillPercentage || 0]} // Fallback to 0 if undefined
                    type="donut"
                    width={350}
                />
            </div>
            <div className='text-center'>اجمالي ساعات الحضور</div>
        </div>
    );
};

export default Chart4;
