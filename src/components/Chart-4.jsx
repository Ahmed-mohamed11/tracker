import ReactApexChart from "react-apexcharts";

const Chart4 = ({ totalHoursOfAttendance }) => (
    <div>
        <div id="chart">
            <ReactApexChart
                options={{
                    chart: { width: 380, type: 'pie' },
                    labels: ['اجمالي ساعات الحضور'],
                    colors: ['#808080'],
                    dataLabels: {
                        enabled: true,
                        formatter: (val) => `${val}%`,
                        style: { fontSize: '18px', fontWeight: 'bold', colors: ['#000'] },
                    },
                    legend: { show: false },
                }}
                series={[totalHoursOfAttendance]}
                type="pie"
                width={350}
            />
        </div>
        <div className='text-center'>اجمالي ساعات الحضور</div>
    </div>
);
export default Chart4