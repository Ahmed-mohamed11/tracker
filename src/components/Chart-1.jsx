import ReactApexChart from "react-apexcharts";

const Chart1 = ({ chartData }) => {
    // استخراج بيانات الحضور، الغياب، والتأخير من البيانات القادمة
    const attendanceData = chartData?.first_chart.attendance_absent_counts || [];
    const intimeData = chartData?.first_chart.attendance_intime_counts || [];
    const lateData = chartData?.first_chart.attendance_late_counts || [];

    // استخراج جميع التواريخ الفريدة وترتيبها
    const categories = Array.from(
        new Set([
            ...attendanceData.map(item => item.date),
            ...intimeData.map(item => item.date),
            ...lateData.map(item => item.date),
        ])
    ).sort();

    // إعداد السلاسل باستخدام البيانات المتوفرة أو القيم الافتراضية
    const series = [
        {
            name: 'الحضور',
            data: categories.map(date => {
                const entry = intimeData?.find(d => d.date === date);
                return entry ? entry.count : 0;
            }),
        },
        {
            name: 'الغياب',
            data: categories.map(date => {
                const entry = attendanceData?.find(d => d.date === date);
                return entry ? entry.count : 0;
            }),
        },
        {
            name: 'التأخير',
            data: categories.map(date => {
                const entry = lateData?.find(d => d.date === date);
                return entry ? entry.count : 0;
            }),
        },
    ];

    // إعداد خيارات الرسم البياني
    const options = {
        chart: {
            height: 350,
            type: 'area',
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
            type: 'datetime',
            categories: categories,
            labels: { format: 'yyyy-MM-dd' },
        },
        tooltip: {
            x: { format: 'yyyy-MM-dd' },
        },
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
            />
        </div>
    );
};

export default Chart1;