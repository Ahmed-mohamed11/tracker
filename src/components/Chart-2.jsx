import ReactApexChart from 'react-apexcharts';

const Chart2 = ({ chartData }) => {
    if (!chartData) {
        return <p>Loading chart data...</p>;
    }

    const options = {
        chart: {
            type: 'bar',
            height: 350,
        },
        colors: ['#FF4560', '#775DD0', '#00E396'],
        xaxis: {
            categories: ['Before Time', 'Departure Before Time', 'Overtime'],
        },
        legend: {
            position: 'top',
        },
    };

    const series = [
        {
            name: 'الحضور المبكر', // تغيير الاسم إلى "الحضور"
            data: [chartData.second_chart.attendance_before_time_counts || 0],
        },
        {
            name: 'الإنصراف المبكر', // تغيير الاسم إلى "التأخير"
            data: [chartData.second_chart.departure_before_time_counts || 0],
        },
        {
            name: 'العمل الإضافي', // تغيير الاسم إلى "الحضور"
            data: [chartData.second_chart.overtime_counts || 0],
        },
    ];

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default Chart2;
