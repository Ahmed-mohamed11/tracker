import ReactApexChart from "react-apexcharts";

const Chart3 = ({ totalHoursOfAttendance, totalAttendancePercentage }) => {
    const fillPercentage = totalHoursOfAttendance > 100 ? 100 : totalHoursOfAttendance;

    // Determine color based on fillPercentage
    const getColorByPercentage = (percentage) => {
        if (percentage < 50) return '#FF0000'; // Red for < 50%
        if (percentage < 75) return '#FFA500'; // Orange for 50% to 75%
        if (percentage < 100) return '#4CAF50'; // Green for 75% to 99%
        return '#0000FF'; // Blue for 100%
    };

    const fillColor = getColorByPercentage(fillPercentage);

    return (
        <div>
            {console.log("fillPercentage", fillPercentage)}
            <div id="chart">
                <ReactApexChart
                    options={{
                        chart: {
                            width: 380,
                            type: 'donut',
                        },
                        labels: ['اجمالي نسبه الحضور'],
                        colors: [fillColor, '#E0E0E0'], // Dynamic color and gray for remainder
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
                                        },
                                        value: {
                                            show: false, // Set to true to display the value
                                            fontSize: '22px',
                                            fontWeight: 'bold',
                                            color: 'green',
                                            formatter: () => `${fillPercentage}`, // Show total attendance directly
                                        },
                                        total: {
                                            show: false, // Show total label
                                            label: 'اجمالي نسبه الحضور',
                                            color: fillColor,
                                            formatter: () => `${fillPercentage}`, // Show percentage in center
                                        },
                                    }
                                }
                            }
                        }
                    }}
                    series={[fillPercentage, 100 - fillPercentage]} // Series for filled and remaining
                    type="donut"
                    width={350}
                />
            </div>
            <div className='text-center'>اجمالي نسبه الحضور</div>
        </div>
    );
};

export default Chart3;
