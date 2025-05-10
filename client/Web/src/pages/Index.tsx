import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconDollarSign from '../components/Icon/IconDollarSign';
import IconInbox from '../components/Icon/IconInbox';
import IconTag from '../components/Icon/IconTag';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconShoppingCart from '../components/Icon/IconShoppingCart';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconCashBanknotes from '../components/Icon/IconCashBanknotes';
import IconUser from '../components/Icon/IconUser';
import IconNetflix from '../components/Icon/IconNetflix';
import IconBolt from '../components/Icon/IconBolt';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconPlus from '../components/Icon/IconPlus';
import IconMultipleForwardRight from '../components/Icon/IconMultipleForwardRight';
import IconUsers from '../components/Icon/IconUsers';
import IconUserPlus from '../components/Icon/IconUserPlus';
import IconCalendar from '../components/Icon/IconCalendar';
import IconCoffee from '../components/Icon/IconCoffee';
import IconBox from '../components/Icon/IconBox';
import IconTrendingUp from '../components/Icon/IconTrendingUp';
import IconClock from '../components/Icon/IconClock';
import IconWheel from '../components/Icon/IconWheel';
import { getAllStats, getOrderStats } from '../services/stats/stats';
import { getAllCustomers } from '../services/customer/customer';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [orderStats, setOrderStats] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, customersData, orderStatsData] = await Promise.all([
                    getAllStats(),
                    getAllCustomers(),
                    getOrderStats()
                ]);

                setStats(statsData);
                setCustomers(customersData);
                setOrderStats(orderStatsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // User Role Distribution Chart
    const userRoleChart: any = {
        series: stats ? Object.values(stats.usersByRole) : [0, 0, 0, 0],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#4361ee'] : ['#4361ee', '#5c1ac3', '#e2a03f', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Restaurant Admin', 'Delivery Person', 'Customer', 'Admin'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    // Order Status Chart
    const orderStatusChart: any = {
        series: orderStats ? Object.values(orderStats.statusBreakdown) : [0],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#00ab55', '#e2a03f', '#e7515a', '#4361ee'] : ['#00ab55', '#e2a03f', '#e7515a', '#4361ee'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: Object.keys(orderStats?.statusBreakdown || {'No Data': 0}).map(status =>
                status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            ),
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    // Revenue Breakdown Chart
    const revenueBreakdownChart: any = {
        series: orderStats ? [
            orderStats.totalRevenue - orderStats.totalDeliveryFees,
            orderStats.totalDeliveryFees,
            orderStats.cancelledRevenue || 0
        ] : [0, 0, 0],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#4361ee', '#00ab55', '#e7515a'] : ['#4361ee', '#00ab55', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return formatCurrency(val);
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return formatCurrency(w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0));
                                },
                            },
                        },
                    },
                },
            },
            labels: ['Food Revenue', 'Delivery Fees', 'Cancelled Orders'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Income',
                data: [16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000, 14000, 17000],
            },
            {
                name: 'Expenses',
                data: [16500, 17500, 16200, 17300, 16000, 19500, 16000, 17000, 16000, 19000, 18000, 19000],
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A'] : ['#1B55E2', '#E7515A'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value / 1000 + 'K';
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    //Daily Sales
    const dailySales: any = {
        series: [
            {
                name: 'Sales',
                data: [44, 55, 41, 67, 22, 43, 21],
            },
            {
                name: 'Last Week',
                data: [13, 23, 20, 8, 13, 27, 33],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
        },
    };

    //Total Orders
    const totalOrders: any = {
        series: [
            {
                name: 'Orders',
                data: [28, 40, 36, 52, 38, 60, 38, 52, 36, 40],
            },
        ],
        options: {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
        },
    };

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    // Format currency function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Overview</span>
                </li>
            </ul>

            <div className="pt-5">
                {/* Business Metrics Cards - Top Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-light dark:bg-primary text-primary dark:text-primary-light">
                                    <IconUsers className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            stats?.totalUsers || 0
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                    <IconBox className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Orders</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            orderStats?.totalOrders || 0
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-success-light dark:bg-success text-success dark:text-success-light">
                                    <IconCashBanknotes className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.totalRevenue || 0)
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-info-light dark:bg-info text-info dark:text-info-light">
                                    <IconCalendar className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Orders Today</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            orderStats?.ordersToday || 0
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Metrics Cards - Second Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-light dark:bg-primary text-primary dark:text-primary-light">
                                    <IconDollarSign className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue Today</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.revenueToday || 0)
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                    <IconTrendingUp className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Average Order Value</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.averageOrderValue || 0)
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-success-light dark:bg-success text-success dark:text-success-light">
                                    <IconWheel className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Delivery Fees</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.totalDeliveryFees || 0)
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="flex items-center">
                            <div className="ltr:mr-5 rtl:ml-5 flex-shrink-0">
                                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light">
                                    <IconCreditCard className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Cancelled Revenue</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-2xl font-semibold dark:text-white-light">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.cancelledRevenue || 0)
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full xl:col-span-2">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">Revenue</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 1]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">Weekly</button>
                                        </li>
                                        <li>
                                            <button type="button">Monthly</button>
                                        </li>
                                        <li>
                                            <button type="button">Yearly</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <p className="text-lg dark:text-white-light/90">
                            Total Revenue <span className="text-primary ml-2">{formatCurrency(orderStats?.totalRevenue || 0)}</span>
                        </p>
                        <div className="relative">
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Revenue Breakdown</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={revenueBreakdownChart.series} options={revenueBreakdownChart.options} type="donut" height={460} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Order Status</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={orderStatusChart.series} options={orderStatusChart.options} type="donut" height={460} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">User Distribution by Role</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={userRoleChart.series} options={userRoleChart.options} type="donut" height={460} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex items-center justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg">User Summary</h5>
                            <div className="dropdown">
                                <Dropdown
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    button={<IconHorizontalDots className="w-5 h-5 text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Done</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="space-y-9">
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-primary-light dark:bg-primary text-primary dark:text-primary-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconCoffee />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Restaurant Admins</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">{stats?.usersByRole?.['restaurant-admin'] || 0}</p>
                                    </div>
                                    <div className="rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#7579ff] to-[#b224ef] h-full rounded-full"
                                             style={{ width: `${stats ? (stats.usersByRole['restaurant-admin'] / stats.totalUsers * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-success-light dark:bg-success text-success dark:text-success-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconWheel />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Delivery Persons</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">{stats?.usersByRole?.['delivery-person'] || 0}</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#3cba92] to-[#0ba360] h-full rounded-full"
                                             style={{ width: `${stats ? (stats.usersByRole['delivery-person'] / stats.totalUsers * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-9 h-9 ltr:mr-3 rtl:ml-3">
                                    <div className="bg-warning-light dark:bg-warning text-warning dark:text-warning-light rounded-full w-9 h-9 grid place-content-center">
                                        <IconUser />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex font-semibold text-white-dark mb-2">
                                        <h6>Customers</h6>
                                        <p className="ltr:ml-auto rtl:mr-auto">{stats?.usersByRole?.['customer'] || 0}</p>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-dark-light dark:bg-[#1b2e4b] shadow">
                                        <div className="bg-gradient-to-r from-[#f09819] to-[#ff5858] h-full rounded-full"
                                             style={{ width: `${stats ? (stats.usersByRole['customer'] / stats.totalUsers * 100) : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                    <div className="panel h-full w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Recent Customers</h5>
                            <Link to="/customers" className="btn btn-primary btn-sm">View All</Link>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Customer</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Joined Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center">
                                                <div className="flex justify-center items-center h-24">
                                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent rounded-full w-5 h-5 inline-flex"></span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : customers && customers.length > 0 ? (
                                        customers.slice(0, 5).map((customer) => (
                                            <tr key={customer.id} className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                                <td className="min-w-[150px] text-black dark:text-white">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-md bg-primary-light text-primary flex items-center justify-center mr-2">
                                                            {customer.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                        <span className="whitespace-nowrap">{customer.firstName} {customer.lastName}</span>
                                                    </div>
                                                </td>
                                                <td className="truncate max-w-[200px]">{customer.email}</td>
                                                <td>{customer.phone || 'N/A'}</td>
                                                <td>{formatDate(customer.createdAt)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">No customers found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="panel h-full w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Order Metrics</h5>
                        </div>
                        <div className="grid grid-cols-1 gap-5">
                            {/* Order Metrics Cards */}
                            <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                                <div className="ltr:mr-4 rtl:ml-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-success-light dark:bg-success text-success dark:text-success-light">
                                        <IconShoppingCart className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-lg font-semibold dark:text-white-light">Total Orders</h5>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {loading ? (
                                            <span className="animate-pulse">Loading...</span>
                                        ) : (
                                            `${orderStats?.totalOrders || 0} orders processed`
                                        )}
                                    </p>
                                </div>
                                <div className="ltr:ml-auto rtl:mr-auto">
                                    <p className="text-2xl font-bold text-success">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            orderStats?.totalOrders || 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                                <div className="ltr:mr-4 rtl:ml-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                        <IconClock className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-lg font-semibold dark:text-white-light">Orders Today</h5>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {loading ? (
                                            <span className="animate-pulse">Loading...</span>
                                        ) : (
                                            `${formatCurrency(orderStats?.revenueToday || 0)} revenue today`
                                        )}
                                    </p>
                                </div>
                                <div className="ltr:ml-auto rtl:mr-auto">
                                    <p className="text-2xl font-bold text-warning">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            orderStats?.ordersToday || 0
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                                <div className="ltr:mr-4 rtl:ml-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-light dark:bg-primary text-primary dark:text-primary-light">
                                        <IconTrendingUp className="w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-lg font-semibold dark:text-white-light">Average Order Value</h5>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {loading ? (
                                            <span className="animate-pulse">Loading...</span>
                                        ) : (
                                            `${formatCurrency(orderStats?.totalDeliveryFees || 0)} in delivery fees`
                                        )}
                                    </p>
                                </div>
                                <div className="ltr:ml-auto rtl:mr-auto">
                                    <p className="text-2xl font-bold text-primary">
                                        {loading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            formatCurrency(orderStats?.averageOrderValue || 0)
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
