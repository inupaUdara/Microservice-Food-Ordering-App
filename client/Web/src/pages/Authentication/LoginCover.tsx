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
import IconEye from '../../components/Icon/IconEye';

const LoginCover = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
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

            if (data.user.role === 'customer') {
                dispatch(signInSuccess(data.user));
                navigate('/restaurants');
            } else if (data.user.role === 'delivery-person') {
                dispatch(signInSuccess(data.user));
                navigate('/orders');
            } else if (data.user.role === 'restaurant-admin') {
                if (data.user.restaurantProfile.isApproved === false) {
                    const message = 'Your restaurant is not approved yet. Please contact the admin.';
                    showMessage('Your restaurant is not approved yet. Please contact the admin.', 'error');
                    dispatch(signInFailure(message));
                    return;
                }
                navigate('/menus');
                dispatch(signInSuccess(data.user));
            } else if (data.user.role === 'admin') {
                dispatch(signInSuccess(data.user));
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
            <div className="relative flex h-screen items-center justify-center bg-[url('/assets/images/auth/bg.jpg')] bg-cover bg-center bg-no-repeat px-3 py-10 dark:bg-[#060818] sm:px-16 ">
                <div className="relative flex w-full max-w-[600px] flex-col justify-between overflow-hidden rounded-md bg-white/65 backdrop-blur-lg dark:bg-black/50 lg:min-h-[600px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px] my-10">
                        <div className=" flex items-center sm:justify-center">
                            <img className="w-8 ml-[5px] inline flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle inline dark:text-white-light transition-all duration-300">QuickBite</span>
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
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            className="form-input ps-10 pe-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                    />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right dark:text-white">
                                    <Link to="/auth/password-recovery" className="text-primary transition hover:text-black dark:hover:text-white">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {loading ? (
                                        <>
                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>Signing
                                            In...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
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
