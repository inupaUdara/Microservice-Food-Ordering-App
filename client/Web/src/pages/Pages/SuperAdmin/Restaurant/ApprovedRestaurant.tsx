import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { approveRestaurant, getAllRestaurants } from '../../../../services/restaurant/restaurant';
import Loader from '../../..//Components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import IconEye from '../../../../components/Icon/IconEye';
import IconPencil from '../../../../components/Icon/IconPencil';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import Swal from 'sweetalert2';
import RestaurantDetailsModal from './RestaurantDetailModel';

const ApprovedRestaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Approved Restaurants'));
    }, [dispatch]);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState([]);

    const [restaurantDetailsOpen, setRestaurantDetailsOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

    const [approvedRestaurants, setApprovedRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const showMessage = (msg = '', type = 'error') => {
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
        const fetchApprovedRestaurants = async () => {
            try {
                setLoading(true);
                const data = await getAllRestaurants();
                setApprovedRestaurants(data);
                setRecordsData(data.slice(0, pageSize));
                setError(null);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load approved restaurants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchApprovedRestaurants();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(approvedRestaurants.slice(from, to));
    }, [page, pageSize, approvedRestaurants]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSelect = (id: string) => {
        setSelectedRestaurantId(id);
        setRestaurantDetailsOpen(true);
    };

    const handleApprove = async (id: string) => {
        try {
            await approveRestaurant(id, true);
            // Refresh the list after approval
            const data = await getAllRestaurants();
            setApprovedRestaurants(data);

            setRecordsData(data.slice(0, pageSize));
            // navigate(0);
        } catch (error) {
            console.error('Error approving restaurant:', error);
            setError('Failed to approve restaurant. Please try again.');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await approveRestaurant(id, false);
            // Refresh the list after rejection
            const data = await getAllRestaurants();
            setApprovedRestaurants(data);
            showMessage('Restaurant deactivated successfully', 'success');
            setRecordsData(data.slice(0, pageSize));
        } catch (error) {
            console.error('Error rejecting restaurant:', error);
            setError('Failed to reject restaurant. Please try again.');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Approved Restaurants</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No approved restaurants found"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'restaurantName',
                                title: 'Restaurant Name',
                                render: ({ restaurantName, logo }) => (
                                    <div className="flex items-center">
                                        <img src={logo} alt={restaurantName} className="w-10 h-10 rounded-full object-cover mr-3" />
                                        <span>{restaurantName}</span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'owner',
                                title: 'Owner',
                                render: ({ owner }) => (
                                    <div>
                                        <div>
                                            {owner?.firstName} {owner?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">{owner?.email}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'restaurantAddress',
                                title: 'Location',
                                render: ({ restaurantAddress }) => (
                                    <div>
                                        <div>
                                            {restaurantAddress?.city}, {restaurantAddress?.state}
                                        </div>
                                        <div className="text-xs text-gray-500">{restaurantAddress?.country}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'restaurantPhone',
                                title: 'Phone',
                            },
                            {
                                accessor: 'createdAt',
                                title: 'Registered On',
                                render: ({ createdAt }) => formatDate(createdAt),
                            },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                titleClassName: '!text-center',
                                render: (restaurant) => (
                                    <div className="flex items-center justify-center space-x-2">
                                        <button type="button" onClick={() => handleSelect(restaurant.id)} className="">
                                            <IconPencil className="w-5 h-5 text-success" />
                                        </button>
                                        {/* <button
                                            type="button"

                                            onClick={() => console.log('Approve', restaurant.id)}
                                        >
                                            <IconPencil className="w-5 h-5 text-primary"/>
                                        </button> */}
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={approvedRestaurants.length}
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
            <RestaurantDetailsModal isOpen={restaurantDetailsOpen} onClose={() => setRestaurantDetailsOpen(false)} rowId={selectedRestaurantId} onApprove={handleApprove} onReject={handleReject} />
        </div>
    );
};

export default ApprovedRestaurants;
