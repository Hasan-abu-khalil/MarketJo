import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';

import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

export default function DashboardCharts({ charts, role }: any) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    return (
        <div className={`grid gap-4 ${role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {/* Sales */}
            <div className="rounded-xl border p-4">
                <h2 className="mb-3 text-sm font-semibold">Sales Overview</h2>

                <div className="h-56">
                    <Line
                        options={options}
                        data={{
                            labels: charts.sales.map((x: any) => x.date),

                            datasets: [
                                {
                                    label: 'Sales',
                                    data: charts.sales.map((x: any) => x.total),

                                    borderColor: '#2563eb',
                                    backgroundColor: '#2563eb',

                                    tension: 0.4,

                                    pointRadius: 2,
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Orders */}
            <div className="rounded-xl border p-4">
                <h2 className="mb-3 text-sm font-semibold">Orders Status</h2>

                <div className="flex h-56 justify-center">
                    <Doughnut
                        options={options}
                        data={{
                            labels: charts.ordersStatus.map((x: any) => x.status),

                            datasets: [
                                {
                                    data: charts.ordersStatus.map((x: any) => x.total),

                                    backgroundColor: ['#facc15', '#22c55e', '#3b82f6', '#ef4444'],
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Products */}
            {charts.productsByStore && (
                <div className="rounded-xl border p-4">
                    <h2 className="mb-3 text-sm font-semibold">Products By Store</h2>

                    <div className="h-56">
                        <Bar
                            options={options}
                            data={{
                                labels: charts.productsByStore.map((x: any) => x.name),

                                datasets: [
                                    {
                                        label: 'Products',

                                        data: charts.productsByStore.map((x: any) => x.products_count),

                                        backgroundColor: '#8b5cf6',
                                    },
                                ],
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
