// مكون Chart1
import ReactApexChart from "react-apexcharts";

const Chart1 = ({ chartData }) => {
    const defaultData = {
        series: [
            {
                name: 'الحضور',
                data: [],
            },
            {
                name: 'الغياب',
                data: [],
            },
            {
                name: 'التأخير',
                data: [],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: { show: false },
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            xaxis: {
                type: 'datetime',
                categories: [], // تواريخ فارغة
            },
            tooltip: {
                x: { format: 'yyyy-MM-dd' }, // تنسيق التاريخ
            },
        },
    };

    const options = {
        ...defaultData.options,
        xaxis: { categories: chartData ? chartData.categories : defaultData.options.xaxis.categories },
    };

    const series = chartData ? chartData.series : defaultData.series;

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
