 import ReactApexChart from 'react-apexcharts';
 
const Chart3 = ({ totalAttendancePercentage }) => (
    <div>
        <div id="chart">
            <ReactApexChart 
                options={{
                    chart: { width: 380, type: 'pie' },
                    labels: ['اجمالي نسبه الحضور'],
                    colors: ['#808080'],
                    dataLabels: {
                        enabled: true,
                        formatter: (val) => `${val}%`,
                        style: { fontSize: '18px', fontWeight: 'bold', colors: ['#000'] },
                    },
                    legend: { show: false },
                }} 
                series={[totalAttendancePercentage]} 
                type="pie" 
                width={350} 
            />
        </div>
        <div className='text-center'>اجمالي نسبه الحضور</div>
    </div>
);
export default Chart3;