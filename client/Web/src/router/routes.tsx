import { lazy } from 'react';
import PrivateRoutes from './privateRoutes';
import RegisterRestaurant from '../pages/Authentication/RegisterRestaurant';
import RegisterDeliveryPerson from '../pages/Authentication/RegisterDeliveryPerson';
import Menus from '../pages/Pages/RestaurantAdmin/RestaurantMenu/Menus';
import Orders from '../pages/Pages/DeliveryPerson/Orders';
import OngoingOrders from '../pages/Pages/Customer/Order/OngoingOrders';
import RestaurantDetails from '../pages/Pages/Customer/RestaurantDetails';
import OrderDetails from '../pages/Pages/Customer/Order/OrderDetails';

import CreateMenus from '../pages/Pages/RestaurantAdmin/RestaurantMenu/CreateMenus';

import UnapprovedRestaurants from '../pages/Pages/SuperAdmin/Restaurant/UnapprovedRestaurants';
import ApprovedRestaurants from '../pages/Pages/SuperAdmin/Restaurant/ApprovedRestaurant';
import AllCustomers from '../pages/Pages/SuperAdmin/Customers/AllCustomers';
import AllDrivers from '../pages/Pages/SuperAdmin/Drivers/AllDrivers';
import Cart from '../pages/Pages/Customer/Order/Cart';
import CheckoutPage from '../pages/Pages/Customer/Order/Checkout';
import UnApprovedOrder from '../pages/Pages/RestaurantAdmin/orders/UnApprovedOrder';
import ApprovedOrder from '../pages/Pages/RestaurantAdmin/orders/ApprovedOrder';
import CompleteOrder from '../pages/Pages/RestaurantAdmin/orders/CompleteOrder';
import EditMenuDetails from '../pages/Pages/RestaurantAdmin/RestaurantMenu/EditMenuDetails';
import AdminDashboard from '../pages/Pages/RestaurantAdmin/AdminDashboard/AdminDashboard';
import ResetPassword from '../pages/Authentication/ResetPassword';

const Restaurants = lazy(() => import('../pages/Pages/Customer/Restaurants'));
const Index = lazy(() => import('../pages/Index'));
const Notification = lazy(() => import('../pages/Components/Notification'));
const Profile = lazy(() => import('../pages/Users/Profile'));
const AccountSetting = lazy(() => import('../pages/Users/AccountSetting'));
const ContactUsCover = lazy(() => import('../pages/Pages/ContactUsCover'));
const Faq = lazy(() => import('../pages/Pages/Faq'));
const ComingSoonCover = lazy(() => import('../pages/Pages/ComingSoonCover'));
const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const About = lazy(() => import('../pages/About'));
const Error = lazy(() => import('../components/Error'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <PrivateRoutes />,
        children: [
            { path: '/dashboard', element: <Index /> },

            {
                path: '/components/notifications',
                element: <Notification />,
            },
            // Users page
            {
                path: '/users/profile',
                element: <Profile />,
            },
            {
                path: '/users/user-account-settings',
                element: <AccountSetting />,
            },
            //customer page
            {
                path: '/restaurants',
                element: <Restaurants />,
            },
            // In your router configuration (e.g., AppRouter.tsx)
            {
                path: '/restaurants/:id',
                element: <RestaurantDetails />, // You'll need to create this component
            },
            {
                path: '/ongoing-orders',
                element: <OngoingOrders />,
            },
            {
                path: '/ongoing-orders/:id',
                element: <OrderDetails />,
            },
            {
                path: '/cart',
                element: <Cart />,
            },
            {
                path: '/checkout',
                element: <CheckoutPage />,
            },

            //restaurant admin dashboard
            {
                path: '/restaurant-admin-dashboard',
                element: <AdminDashboard />,
            },

            //restaurant admin menu page
            {
                path: '/menus',
                element: <Menus />,
            },

            //create menu page
            {
                path: '/create-menu',
                element: <CreateMenus />,
            },

            //restaurants un-approved orders page
            {
                path: '/restaurants-unapproved-orders',
                element: <UnApprovedOrder />,
            },

            //restaurants approved orders page
            {
                path: '/restaurants-approved-orders',
                element: <ApprovedOrder />,
            },

            //resturent complete orders page
            {
                path: '/restaurants-complete-orders',
                element: <CompleteOrder />,
            },

            {
                path: 'edit-menu/:menuId',
                element: <EditMenuDetails />,
            },

            //delivery person page
            {
                path: '/orders',
                element: <Orders />,
            },

            // super admin
            {
                path: '/unapproved-restaurants',
                element: <UnapprovedRestaurants />,
            },
            {
                path: '/approved-restaurants',
                element: <ApprovedRestaurants />,
            },
            {
                path: '/customers',
                element: <AllCustomers />,
            },
            {
                path: '/drivers',
                element: <AllDrivers />,
            },
        ],
    },


    // pages
    {
        path: '/pages/contact-us-cover',
        element: <ContactUsCover />,
        layout: 'blank',
    },
    {
        path: '/pages/faq',
        element: <Faq />,
    },
    {
        path: '/pages/coming-soon-cover',
        element: <ComingSoonCover />,
        layout: 'blank',
    },
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },

    //Authentication
    {
        path: '/auth/login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/auth/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/auth/register-restaurant',
        element: <RegisterRestaurant />,
        layout: 'blank',
    },
    {
        path: '/auth/register-delivery-person',
        element: <RegisterDeliveryPerson />,
        layout: 'blank',
    },
    {
        path: '/auth/password-recovery',
        element: <RecoverIdCover />,
        layout: 'blank',
    },
    {
        path: '/auth/reset-password',
        element: <ResetPassword />,
        layout: 'blank',
    },
    {
        path: '/about',
        element: <About />,
        layout: 'blank',
    },
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
