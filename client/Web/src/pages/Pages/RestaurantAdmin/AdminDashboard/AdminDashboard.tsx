'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import type { IRootState } from '../../../../store';
import { DollarSign, Truck, RefreshCw, ChevronUp, Filter } from 'lucide-react';
import { getOutForDeliveryStats } from '../../../../services/order/order';

import DeliveryAnalyticsChart from './components/DeliveryAnalyticsChart';
import MonthlyPerformance from './components/MonthlyPerformance';

function AdminDashboard() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Dashboard'));
    }, [dispatch]);

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deliveryStats, setDeliveryStats] = useState<any>({
        totalOrders: 0,
        totalAmount: 0,
        monthlyStats: [],
    });
    const [timeframe, setTimeframe] = useState('yearly');

    useEffect(() => {
        const fetchDeliveryStats = async () => {
            try {
                setLoading(true);
                const data = await getOutForDeliveryStats();
                setDeliveryStats(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch delivery statistics');
                console.error('Error fetching delivery stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryStats();
    }, []);

    // Calculate stats for cards and components
    const avgOrdersPerMonth = deliveryStats.totalOrders / 12;
    const avgRevenuePerMonth = deliveryStats.totalAmount / 12;

    // Find the month with highest orders and revenue
    const highestOrderMonth = deliveryStats.monthlyStats?.reduce((prev: any, current: any) => (prev.orders > current.orders ? prev : current), { month: 'N/A', orders: 0 });

    const highestRevenueMonth = deliveryStats.monthlyStats?.reduce((prev: any, current: any) => (prev.amount > current.amount ? prev : current), { month: 'N/A', amount: 0 });

    // Currency symbol used throughout the dashboard
    const currencySymbol = 'LKR';

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/" className="text-indigo-600 hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500 dark:text-gray-400">
                        <span>Delivery Analytics</span>
                    </li>
                </ul>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Delivery Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Delivery Orders</h3>
                        <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Truck className="w-5 h-5" />
                        </span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : deliveryStats.totalOrders.toLocaleString()}</span>
                        <span className="ml-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                            <ChevronUp className="w-4 h-4" />
                            <span>12%</span>
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Compared to previous period</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Delivery Revenue</h3>
                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {loading
                                ? '...'
                                : `${currencySymbol}${deliveryStats.totalAmount.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  })}`}
                        </span>
                        <span className="ml-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                            <ChevronUp className="w-4 h-4" />
                            <span>8.2%</span>
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Compared to previous period</p>
                </div>
            </div>

            {/* Delivery Analytics Chart Component */}
            <DeliveryAnalyticsChart loading={loading} error={error} monthlyStats={deliveryStats.monthlyStats || []} isDark={isDark} isRtl={isRtl} currencySymbol={currencySymbol} />

            {/* Monthly Performance Component */}
            <MonthlyPerformance
                loading={loading}
                highestOrderMonth={highestOrderMonth}
                highestRevenueMonth={highestRevenueMonth}
                avgOrdersPerMonth={avgOrdersPerMonth}
                avgRevenuePerMonth={avgRevenuePerMonth}
                currencySymbol={currencySymbol}
            />
        </div>
    );
}

export default AdminDashboard;
