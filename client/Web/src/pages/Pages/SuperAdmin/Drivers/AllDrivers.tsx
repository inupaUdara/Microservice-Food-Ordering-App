import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import Loader from '../../../Components/Loader';
import { Link } from 'react-router-dom';
import IconEye from '../../../../components/Icon/IconEye';
import IconPencil from '../../../../components/Icon/IconPencil';
import Swal from 'sweetalert2';
import { getAllDrivers } from '../../../../services/driver/driver';

const AllDrivers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('All Drivers'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState([]);

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                setLoading(true);
                const data = await getAllDrivers();
                setDrivers(data);
                setRecordsData(data.slice(0, pageSize));
                setError(null);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                setError('Failed to load drivers. Please try again later.');
                showMessage('Failed to load drivers', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(drivers.slice(from, to));
    }, [page, pageSize, drivers]);

    const getVehicleTypeBadge = (type: string) => {
        const typeMap: Record<string, string> = {
            bike: 'bg-blue-100 text-blue-800',
            car: 'bg-green-100 text-green-800',
            truck: 'bg-orange-100 text-orange-800',
            van: 'bg-purple-100 text-purple-800'
        };
        return typeMap[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDriverId = (id: string) => {
        return `DRV-${id.substring(id.length - 6).toUpperCase()}`;
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">All Drivers</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No drivers found"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'id',
                                title: 'Driver ID',
                                render: ({ id }) => (
                                    <span className="font-medium">{formatDriverId(id)}</span>
                                )
                            },
                            {
                                accessor: 'owner',
                                title: 'Driver Email',
                                render: ({ owner }) => (
                                    <div>
                                        {owner?.email || 'N/A'}
                                    </div>
                                )
                            },
                            {
                                accessor: 'vehicleType',
                                title: 'Vehicle Type',
                                render: ({ vehicleType }) => (
                                    <span className={`px-2 py-1 rounded-full text-xs ${getVehicleTypeBadge(vehicleType)}`}>
                                        {vehicleType ? vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) : 'N/A'}
                                    </span>
                                )
                            },
                            {
                                accessor: 'vehicleNumber',
                                title: 'Vehicle Number'
                            },
                            {
                                accessor: 'licenseNumber',
                                title: 'License Number'
                            },
                            {
                                accessor: 'documents',
                                title: 'Documents',
                                render: ({ documents }) => (
                                    <span className="text-xs">
                                        {documents?.length || 0} uploaded
                                    </span>
                                )
                            },
                            // {
                            //     accessor: 'actions',
                            //     title: 'Actions',
                            //     titleClassName: '!text-center',
                            //     render: (driver) => (
                            //         <div className="flex items-center justify-center space-x-2">
                            //             <Link
                            //                 to={`/drivers/${driver.id}`}
                            //                 className="btn btn-outline-primary p-1 rounded"
                            //             >
                            //                 <IconEye className="w-5 h-5" />
                            //             </Link>
                            //             <button
                            //                 type="button"
                            //                 className="btn btn-outline-success p-1 rounded"
                            //                 onClick={() => console.log('Edit', driver.id)}
                            //             >
                            //                 <IconPencil className="w-5 h-5" />
                            //             </button>
                            //         </div>
                            //     )
                            // }
                        ]}
                        totalRecords={drivers.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default AllDrivers;
