import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import Loader from '../../../Components/Loader';
import { Link } from 'react-router-dom';
import IconEye from '../../../../components/Icon/IconEye';
import IconPencil from '../../../../components/Icon/IconPencil';
import Swal from 'sweetalert2';
import { getAllCustomers } from '../../../../services/customer/customer';

const AllCustomers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('All Customers'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState([]);

    const [customers, setCustomers] = useState([]);
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
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const data = await getAllCustomers();
                setCustomers(data);
                setRecordsData(data.slice(0, pageSize));
                setError(null);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setError('Failed to load customers. Please try again later.');
                showMessage('Failed to load customers', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(customers.slice(from, to));
    }, [page, pageSize, customers]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address: any) => {
        if (!address || Object.keys(address).length === 0) return 'Not specified';
        return `${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''}`.replace(/, ,/g, '').replace(/^, /, '');
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Customers</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No customers found"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'id',
                                title: 'Customer ID',
                                render: ({ id }) => (
                                    <span className="font-medium">#{id.substring(0, 8)}</span>
                                )
                            },
                            {
                                accessor: 'name',
                                title: 'Name',
                                render: ({ firstName, lastName }) => (
                                    <div>
                                        {firstName} {lastName}
                                    </div>
                                )
                            },
                            {
                                accessor: 'email',
                                title: 'Email'
                            },
                            {
                                accessor: 'phone',
                                title: 'Phone'
                            },
                            {
                                accessor: 'address',
                                title: 'Address',
                                render: ({ address }) => (
                                    <div className="text-xs">
                                        {formatAddress(address)}
                                    </div>
                                )
                            },
                            {
                                accessor: 'createdAt',
                                title: 'Registered On',
                                render: ({ createdAt }) => formatDate(createdAt)
                            },
                            // {
                            //     accessor: 'actions',
                            //     title: 'Actions',
                            //     titleClassName: '!text-center',
                            //     render: (customer) => (
                            //         <div className="flex items-center justify-center space-x-2">
                            //             <Link
                            //                 to={`/customers/${customer.id}`}
                            //                 className="btn btn-outline-primary p-1 rounded"
                            //             >
                            //                 <IconEye className="w-5 h-5" />
                            //             </Link>
                            //             <button
                            //                 type="button"
                            //                 className="btn btn-outline-success p-1 rounded"
                            //                 onClick={() => console.log('Edit', customer.id)}
                            //             >
                            //                 <IconPencil className="w-5 h-5" />
                            //             </button>
                            //         </div>
                            //     )
                            // }
                        ]}
                        totalRecords={customers.length}
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

export default AllCustomers;
