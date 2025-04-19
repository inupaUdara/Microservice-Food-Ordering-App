import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { signInStart, signInSuccess, signInFailure } from '../../store/userConfigSlice';
import Swal from 'sweetalert2';
import axiosInstanceNoToken from '../../services/axiosInstanceNoToken';

const LoginCover = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { loading, error: errorMessage } = useSelector((state: IRootState) => state.userConfig);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    });
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

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

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            const message = 'Please fill all the fields!';
            dispatch(signInFailure(message));
            showMessage(message);
            return;
        }

        try {
            dispatch(signInStart());

            const response = await axiosInstanceNoToken.post('users/api/v1/auth/sign-in', {
                email,
                password,
            });

            const data = response.data;
            localStorage.setItem('token', data.token);
            console.log('Login response:', data.user);
            dispatch(signInSuccess(data.user));
            if (data.user.role === 'customer') {
                navigate('/restaurants');
            } else if (data.user.role === 'delivery-person') {
                navigate('/orders');
            } else if (data.user.role === 'restaurant-admin') {
                navigate('/menus');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';

            dispatch(signInFailure(message));
            showMessage(message);
        }
    };

    return (
        <div>
            <div className="relative flex h-screen items-center justify-center bg-[url('/assets/images/auth/bg.jpg')] bg-cover bg-center bg-no-repeat px-20 py-10 dark:bg-[#060818] sm:px-16 ">
                <div className="relative flex w-full max-w-[600px] flex-col justify-between overflow-hidden rounded-md bg-white/65 backdrop-blur-lg dark:bg-black/50 lg:min-h-[600px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px] my-10">
                        <div className=" flex items-center justify-center">
                            <img className="w-8 ml-[5px] hidden md:inline flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">QuickBite</span>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-10">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-black md:text-4xl dark:text-white">Sign in</h1>
                                <p className="text-base font-bold leading-normal dark:text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Username">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="email"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign in
                                </button>
                            </form>
                            <div className="text-center dark:text-white mt-4">
                                Doesn't have an account ?&nbsp;
                                <Link to="/auth/register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN UP
                                </Link>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()} QuickBite All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
