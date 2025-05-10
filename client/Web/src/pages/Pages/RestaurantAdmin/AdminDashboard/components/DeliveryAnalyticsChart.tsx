import ReactApexChart from 'react-apexcharts';
import { AlertCircle } from 'lucide-react';

interface DeliveryAnalyticsChartProps {
    loading: boolean;
    error: string | null;
    monthlyStats: any[];
    isDark: boolean;
    isRtl: boolean;
    currencySymbol?: string;
}

const DeliveryAnalyticsChart = ({ loading, error, monthlyStats, isDark, isRtl, currencySymbol = 'LKR' }: DeliveryAnalyticsChartProps) => {
    // Prepare chart data from the API response
    const deliveryChartData = {
        series: [
            {
                name: 'Orders',
                type: 'column',
                data: monthlyStats?.map((stat: any) => stat.orders) || Array(12).fill(0),
            },
            {
                name: 'Revenue',
                type: 'line',
                data: monthlyStats?.map((stat: any) => stat.amount) || Array(12).fill(0),
            },
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                fontFamily: 'Inter, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: false,
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [0, 3],
                curve: 'smooth',
            },
            colors: isDark ? ['#4361ee', '#10b981'] : ['#4361ee', '#10b981'],
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    borderRadius: 5,
                },
            },
            fill: {
                opacity: [0.85, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: 'vertical',
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                },
            },
            labels: monthlyStats?.map((stat: any) => stat.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            markers: {
                size: 4,
                strokeWidth: 0,
                hover: {
                    size: 7,
                },
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: isDark ? '#cbd5e1' : '#64748b',
                        fontSize: '12px',
                    },
                },
            },
            yaxis: [
                {
                    title: {
                        text: 'Orders',
                        style: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                        },
                    },
                    labels: {
                        style: {
                            colors: isDark ? '#cbd5e1' : '#64748b',
                            fontSize: '12px',
                        },
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: `Revenue (${currencySymbol})`,
                        style: {
                            color: isDark ? '#cbd5e1' : '#64748b',
                        },
                    },
                    labels: {
                        style: {
                            colors: isDark ? '#cbd5e1' : '#64748b',
                            fontSize: '12px',
                        },
                        formatter: (value: number) => `${currencySymbol} ${value.toFixed(0)}`,
                    },
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                theme: isDark ? 'dark' : 'light',
                y: {
                    formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
                        if (seriesIndex === 0) {
                            return value + ' orders';
                        } else {
                            return `${currencySymbol} ${value.toFixed(2)}`;
                        }
                    },
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
                labels: {
                    colors: isDark ? '#cbd5e1' : '#64748b',
                },
            },
            grid: {
                borderColor: isDark ? '#334155' : '#e2e8f0',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
        },
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Out for Delivery Analytics</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly breakdown of orders and revenue</p>
                </div>

                {loading && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        Loading data...
                    </div>
                )}
            </div>

            {error ? (
                <div className="flex items-center justify-center h-80 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-center p-6 max-w-md">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Failed to load data</h3>
                        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                        {loading ? (
                            <div className="min-h-[350px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08]">
                                <span className="animate-spin border-2 border-indigo-500 border-t-transparent rounded-full w-6 h-6 inline-flex"></span>
                            </div>
                        ) : (
                            <ReactApexChart options={deliveryChartData.options} series={deliveryChartData.series} type="line" height={350} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryAnalyticsChart;
