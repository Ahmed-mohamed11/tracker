import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    const [series] = useState([100]);
    const [options] = useState({
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Team A'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        }],
        // colors: ['#'], // تعيين اللون الرمادي
        dataLabels: {
            enabled: true, // تفعيل تسميات البيانات
            formatter: function (val) {
                return `${val}%`; // عرض النسبة المئوية
            },
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                colors: ['#000'], // لون النص
            },
        },
        legend: {
            show: false, // إخفاء اسم الإحصائية
        },
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="pie" width={350} />
            </div>
            <div className='text-center' id="html-dist">اجمالي ساعات الحضور</div>
        </div>
    );
};

export default ApexChart;
