import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import ApprovedRestaurants from './ApprovedRestaurant';
import UnapprovedRestaurants from './UnapprovedRestaurants';
import { Link } from 'react-router-dom';

const AllRestaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Restaurants'));
    }, [dispatch]);
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/approve-restaurants" className="text-primary hover:underline">
                        Restaurants
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span> </span>
                </li>
            </ul>
            <UnapprovedRestaurants />
            <ApprovedRestaurants />
        </div>
    );
};

export default AllRestaurants;
