import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconHome from '../Icon/IconHome';
import IconUsers from '../Icon/IconUsers';
import IconWheel from '../Icon/IconWheel';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <div className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('QuickBite')}</span>
                        </div>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-90px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-3">
                            {currentUser && currentUser.role === 'customer' && (
                                <>
                                    <li className="menu nav-item">
                                        <li className="nav-item">
                                            <NavLink to="/restaurants" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Restaurants')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </li>
                                    <li className="menu nav-item">
                                        <li className="nav-item">
                                            <NavLink to="/ongoing-orders" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Orders')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </li>
                                </>
                            )}
                            {currentUser && currentUser.role === 'restaurant-admin' && (
                                <>
                                    <li className="menu nav-item">
                                        <li className="nav-item">
                                            <NavLink to="/restaurant-admin-dashboard" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuCharts className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Dashboard')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </li>
                                    <li className="menu nav-item">
                                        <li className="nav-item">
                                            <NavLink to="/menus" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Menus')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </li>
                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'Orders' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Orders')}>
                                            <div className="flex items-center">
                                                <IconMenuTodo className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('All Orders')}</span>
                                            </div>

                                            <div className={currentMenu !== 'Orders' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'Orders' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <NavLink to="/restaurants-unapproved-orders">{t('Unapproved')}</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/restaurants-approved-orders">{t('Approved')}</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/restaurants-complete-orders">{t('Complete')}</NavLink>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                </>
                            )}
                            {currentUser && currentUser.role === 'delivery-person' && (
                                <>
                                    <li className="menu nav-item">
                                        <li className="nav-item">
                                            <NavLink to="/orders" className="group">
                                                <div className="flex items-center">
                                                    <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Orders')}</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </li>
                                </>
                            )}

                            {currentUser && currentUser.role === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/dashboard" className="group">
                                            <div className="flex items-center">
                                                <IconMenuDashboard className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                            </div>
                                        </NavLink>
                                    </li>

                                    <li className="menu nav-item">
                                        <button type="button" className={`${currentMenu === 'restaurant' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('restaurant')}>
                                            <div className="flex items-center">
                                                <IconHome className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Restaurant')}</span>
                                            </div>

                                            <div className={currentMenu !== 'restaurant' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'restaurant' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <NavLink to="/unapproved-restaurants">{t('Unapproved')}</NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/approved-restaurants">{t('Approved')}</NavLink>
                                                </li>
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/customers" className="group">
                                            <div className="flex items-center">
                                                <IconUsers className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Customers')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/drivers" className="group">
                                            <div className="flex items-center">
                                                <IconWheel className="group-hover:!text-primary shrink-0" />
                                                <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Drivers')}</span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'Account' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('Account')}>
                                    <div className="flex items-center">
                                        <IconMenuUsers className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Account')}</span>
                                    </div>

                                    <div className={currentMenu !== 'Account' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'Account' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/users/profile">{t('profile')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/users/user-account-settings">{t('account_settings')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
