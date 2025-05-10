interface MonthlyPerformanceProps {
    loading: boolean;
    highestOrderMonth: { month: string; orders: number };
    highestRevenueMonth: { month: string; amount: number };
    avgOrdersPerMonth: number;
    avgRevenuePerMonth: number;
    currencySymbol?: string;
}

const MonthlyPerformance = ({ loading, highestOrderMonth, highestRevenueMonth, avgOrdersPerMonth, avgRevenuePerMonth, currencySymbol = 'LKR' }: MonthlyPerformanceProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Performance</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Order Month</span>
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{loading ? '...' : highestOrderMonth.month}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Total Orders</span>
                            <span>{loading ? '...' : highestOrderMonth.orders} orders</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Revenue Month</span>
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{loading ? '...' : highestRevenueMonth.month}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Total Revenue</span>
                            <span>
                                {loading
                                    ? '...'
                                    : `${currencySymbol} ${highestRevenueMonth.amount.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })}`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Monthly Orders</span>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{loading ? '...' : avgOrdersPerMonth.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Orders per Month</span>
                            <span>{loading ? '...' : `${(avgOrdersPerMonth / 30).toFixed(1)} per day (avg)`}</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Monthly Revenue</span>
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                {loading
                                    ? '...'
                                    : `${currencySymbol} ${avgRevenuePerMonth.toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Revenue per Month</span>
                            <span>
                                {loading
                                    ? '...'
                                    : `${currencySymbol} ${(avgRevenuePerMonth / 30).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })} per day (avg)`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyPerformance;
