import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const generateDayWiseTimeSeries = (baseval, count, yrange) => {
    let i = 0;
    let series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        series.push([x, y]);
        baseval += 86400000; // 1 day in milliseconds
        i++;
    }
    return series;
};

const ApexChart = () => {
    const [chartData] = useState({
        series: [
            {
                name: 'العمل الإضافي', // تغيير الاسم إلى "الحضور"
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60,
                }),
            },
            {
                name: 'الحضور المبكر', // تغيير الاسم إلى "الحضور"
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 60,
                }),
            },

            {
                name: 'الإنصراف المبكر', // تغيير الاسم إلى "التأخير"
                data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
                    min: 10,
                    max: 15,
                }),
            },
        ],
        options: {
            chart: {
                type: 'area',
                height: 350,
                stacked: true,
                events: {
                    selection: function (chart, e) {
                        console.log(new Date(e.xaxis.min));
                    },
                },
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false, // إيقاف تفعيل التكبير
                },
            },

            colors: ['#008FFB', '#00E396', '#CED4DC'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'monotoneCubic',
            },
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.8,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
            },
            xaxis: {
                type: 'datetime',
            },
        },
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="area"
                    height={350}
                />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default ApexChart;
