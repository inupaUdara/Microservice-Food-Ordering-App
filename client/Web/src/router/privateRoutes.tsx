import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { IRootState } from '../store';

const PrivateRoutes = () => {
    const { currentUser } = useSelector((state: IRootState) => state.userConfig);
    console.log('Current User:', currentUser);
    return currentUser ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default PrivateRoutes;
