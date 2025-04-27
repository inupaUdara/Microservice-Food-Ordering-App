import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';
import IconRestore from '../../components/Icon/IconRestore';
import IconHome from '../../components/Icon/IconHome';
import IconMenu from '../../components/Icon/IconMenu';
import IconWheel from '../../components/Icon/IconWheel';
import Swal from 'sweetalert2';
import { signUpFailure, signUpStart, signUpSuccess } from '../../store/userConfigSlice';
import axiosInstanceNoToken from '../../services/axiosInstanceNoToken';

const RegisterCover = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        // street: '',
        // city: '',
        // state: '',
        // zipCode: '',
        // country: '',
    });

    const { loading, error: errorMessage } = useSelector((state: IRootState) => state.userConfig);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Register Cover'));
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { firstName, lastName, email, password, phone  } = formData;
        if (!firstName || !lastName || !email || !password || !phone ) {
            const message = 'Please fill all the fields!';
            dispatch(signUpFailure(message));
            showMessage(message);
            return;
        }
        try {
            dispatch(signUpStart());

            const response = await axiosInstanceNoToken.post('users/api/v1/auth/sign-up', {
                firstName,
                lastName,
                email,
                password,
                phone,
                role: 'customer',
            });
            const data = response.data;
            dispatch(signUpSuccess(data));
            showMessage('Registration successful!', 'success');
            navigate('/auth/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            dispatch(signUpFailure(message));
            showMessage(message);
        }
    };

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/bg.jpg)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative flex w-full max-w-[600px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className=" flex items-center justify-center">
                            <img className="w-8 ml-[5px] hidden md:inline flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">QuickBite</span>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-10">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-black md:text-4xl">Sign Up</h1>
                                <p className="text-base font-bold leading-normal dark:text-white-dark">Enter your details to register</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="FirstName">First Name</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="FirstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter First Name"
                                                onChange={handleChange}
                                                value={formData.firstName}
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="LastName">Last Name</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="LastName"
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter Last Name"
                                                onChange={handleChange}
                                                value={formData.lastName}
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter Email"
                                            onChange={handleChange}
                                            value={formData.email}
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
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Phone">Phone</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Phone"
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">📞</span>
                                    </div>
                                </div>

                                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="Street">Street</label>
                                        <input
                                            id="Street"
                                            type="text"
                                            placeholder="123 Main St"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="form-input placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="City">City</label>
                                        <input
                                            id="City"
                                            type="text"
                                            placeholder="New York"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="form-input placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="State">State</label>
                                        <input id="State" type="text" placeholder="NY" name="state" value={formData.state} onChange={handleChange} className="form-input placeholder:text-white-dark" />
                                    </div>
                                    <div>
                                        <label htmlFor="ZipCode">Zip Code</label>
                                        <input
                                            id="ZipCode"
                                            type="text"
                                            placeholder="10001"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="form-input placeholder:text-white-dark"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="Country">Country</label>
                                        <input
                                            id="Country"
                                            type="text"
                                            placeholder="USA"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="form-input placeholder:text-white-dark"
                                        />
                                    </div>
                                </div> */}

                                {/* <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">Subscribe to weekly newsletter</span>
                                    </label>
                                </div> */}
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign Up
                                </button>
                            </form>

                            <div className="relative my-7 text-center md:mb-4">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            <div className="mb-10 md:mb-[60px]">
                                <div className="text-center dark:text-white pb-4">Register as</div>
                                <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
                                    <li>
                                        <Link
                                            to="/auth/register-restaurant"
                                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:scale-105 text-sm font-medium"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
                                            }}
                                        >
                                            <IconMenu />
                                            Restaurant
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/auth/register-delivery-person"
                                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:scale-105 text-sm font-medium"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
                                            }}
                                        >
                                            <IconWheel fill={true} />
                                            Delivery Person
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center dark:text-white">
                                Already have an account ?&nbsp;
                                <Link to="/auth/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    SIGN IN
                                </Link>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.quickbite All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;
