import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    const [chartData] = useState({
        series: [
            {
                name: 'الحضور',
                data: [31, 40, 28, 51, 42, 109, 100],
            },
            {
                name: 'الغياب',
                data: [11, 32, 45, 32, 34, 52, 41],
            },
            {
                name: 'التأخير',
                data: [11, 32, 45, 32, 34, 52, 41],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'area',
                toolbar: {
                    show: false, // إخفاء أدوات التحكم في الرسم
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth',
            },
            xaxis: {
                type: 'category', // Use 'category' type for dates
                categories: [
                    '2018-09-19',
                    '2018-09-20',
                    '2018-09-21',
                    '2018-09-22',
                    '2018-09-23',
                    '2018-09-24',
                    '2018-09-25',
                ],
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy', // Adjust the tooltip format for dates
                },
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
