import { Link } from 'react-router-dom';
import { FormEvent, useEffect, useState, useRef } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import { IRootState } from '../../store';
import { updateFailure, updateStart, updateSuccess } from '../../store/userConfigSlice';
import Swal from 'sweetalert2';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconWheel from '../../components/Icon/IconWheel';
import IconX from '../../components/Icon/IconX';
import { updateMe } from '../../services/me/me';
import { uploadImage, updateImage } from '../../services/upload/upload';
import IconFile from '../../components/Icon/IconFile';

const AccountSetting = () => {
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const dispatch = useDispatch();
    const [tabs, setTabs] = useState<string>('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const documentFileInputRef = useRef<HTMLInputElement>(null);

    // Preview states
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [documentPreviews, setDocumentPreviews] = useState<{[key: string]: string}>({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
        ...(currentUser?.role === 'delivery-person' && {
            vehicleType: '',
            vehicleNumber: '',
            licenseNumber: '',
            profilePicture: '',
            documents: [],
        }),
        ...(currentUser?.role === 'restaurant-admin' && {
            restaurantName: '',
            restaurantPhone: '',
            logo: '',
            restaurantAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            openingHours: [],
        }),
    });

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                },
                ...(currentUser.driverProfile && {
                    vehicleType: currentUser.driverProfile.vehicleType,
                    vehicleNumber: currentUser.driverProfile.vehicleNumber,
                    licenseNumber: currentUser.driverProfile.licenseNumber,
                    profilePicture: currentUser.driverProfile.profilePicture,
                    documents: currentUser.driverProfile.documents || [],
                }),
                ...(currentUser.restaurantProfile && {
                    restaurantName: currentUser.restaurantProfile.restaurantName,
                    restaurantPhone: currentUser.restaurantProfile.restaurantPhone,
                    restaurantAddress: currentUser.restaurantProfile.restaurantAddress,
                    openingHours: currentUser.restaurantProfile.openingHours,
                    logo: currentUser.restaurantProfile.logo,
                }),
            });

            // Set initial previews
            if (currentUser.restaurantProfile?.logo) {
                setLogoPreview(currentUser.restaurantProfile.logo);
            }

            if (currentUser.driverProfile?.profilePicture) {
                setProfilePicturePreview(currentUser.driverProfile.profilePicture);
            }

            if (currentUser.driverProfile?.documents?.length > 0) {
                const docPreviews = {};
                currentUser.driverProfile.documents.forEach(doc => {
                    docPreviews[doc.type] = doc.url;
                });
                setDocumentPreviews(docPreviews);
            }
        }
    }, [currentUser, dispatch]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) ? '' : 'Invalid email address';
    };

    const validatePhone = (phone: string) => {
        const re = /^\+?(\d[\d-. ]+)?($$[\d-. ]+$$)?[\d-. ]+\d$/;
        const digits = phone.replace(/\D/g, '');
        if (!re.test(phone)) return 'Invalid phone number format';
        if (digits.length < 10) return 'Phone number must have at least 10 digits';
        return '';
    };

    const showErrorMessage = (msg = '', type = 'error') => {
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

    const showSuccessMessage = (msg = '', type = 'success') => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
            setErrors(prev => ({ ...prev, address: { ...prev.address, [field]: '' } }));
        } else if (name.startsWith('restaurantAddress.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                restaurantAddress: { ...prev.restaurantAddress, [field]: value }
            }));
            setErrors(prev => ({ ...prev, restaurantAddress: { ...prev.restaurantAddress, [field]: '' } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleOpeningHoursChange = (index: number, field: 'open' | 'close', value: string) => {
        const updatedHours = formData.openingHours.map((hour, i) =>
            i === index ? { ...hour, [field]: value } : hour
        );
        setFormData(prev => ({ ...prev, openingHours: updatedHours }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'profilePicture') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a preview
        const reader = new FileReader();
        reader.onload = (event) => {
            if (type === 'logo') {
                setLogoPreview(event.target?.result as string);
            } else {
                setProfilePicturePreview(event.target?.result as string);
            }
        };
        reader.readAsDataURL(file);

        try {
            setIsUploading(true);

            let imageUrl;
            if (type === 'logo' && currentUser?.restaurantProfile?.logo) {
                // Extract ID from the existing logo URL if needed
                const logoId = extractImageId(currentUser.restaurantProfile.logo);

                    const response = await uploadImage(file);
                    imageUrl = response.url;

                setFormData(prev => ({ ...prev, logo: imageUrl }));
            } else if (type === 'profilePicture' && currentUser?.driverProfile?.profilePicture) {
                const pictureId = extractImageId(currentUser.driverProfile.profilePicture);
                // if (pictureId) {
                //     const response = await updateImage(pictureId, file);
                //     imageUrl = response.url;
                // } else {
                    const response = await uploadImage(file);
                    imageUrl = response.url;
                // }
                setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
            } else {
                const response = await uploadImage(file);
                imageUrl = response.url;
                if (type === 'logo') {
                    setFormData(prev => ({ ...prev, logo: imageUrl }));
                } else {
                    setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
                }
            }

            showSuccessMessage('Image uploaded successfully');
        } catch (error) {
            showErrorMessage('Failed to upload image');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setDocumentPreviews(prev => ({
                ...prev,
                [docType]: event.target?.result as string
            }));
        };
        reader.readAsDataURL(file);

        try {
            setIsUploading(true);

            // Find if document of this type already exists
            const existingDocIndex = formData.documents?.findIndex(doc => doc.type === docType);
            let imageUrl;

            if (existingDocIndex !== -1 && existingDocIndex !== undefined) {
                const docId = extractImageId(formData.documents[existingDocIndex].url);
                if (docId) {
                    const response = await updateImage(docId, file);
                    imageUrl = response.url;
                } else {
                    const response = await uploadImage(file);
                    imageUrl = response.url;
                }

                // Update the existing document
                const updatedDocs = [...formData.documents];
                updatedDocs[existingDocIndex] = {
                    ...updatedDocs[existingDocIndex],
                    url: imageUrl
                };
                setFormData(prev => ({ ...prev, documents: updatedDocs }));
            } else {
                // Add new document
                const response = await uploadImage(file);
                imageUrl = response.url;

                const newDoc = {
                    type: docType,
                    url: imageUrl,
                    verified: false
                };

                setFormData(prev => ({
                    ...prev,
                    documents: [...(prev.documents || []), newDoc]
                }));
            }

            showSuccessMessage('Document uploaded successfully');
        } catch (error) {
            showErrorMessage('Failed to upload document');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Helper function to extract image ID from URL if needed
    const extractImageId = (url: string): string | null => {
        // This is a placeholder - you'll need to implement based on your URL structure
        // Example: if your URL is like "https://example.com/images/abc123.jpg"
        // you might extract "abc123" as the ID
        const match = url.match(/\/([^\/]+)\.[^\.]+$/);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors: any = {
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            ...(currentUser?.role === 'delivery-person' && {
                vehicleType: !formData.vehicleType ? 'Vehicle type is required' : '',
                vehicleNumber: !formData.vehicleNumber ? 'Vehicle number is required' : '',
                licenseNumber: !formData.licenseNumber ? 'License number is required' : '',
            }),
            ...(currentUser?.role === 'restaurant-admin' && {
                restaurantName: !formData.restaurantName ? 'Restaurant name is required' : '',
                restaurantPhone: validatePhone(formData.restaurantPhone),
            }),
        };

        // Filter out empty error messages
        const filteredErrors = Object.fromEntries(
            Object.entries(validationErrors).filter(([_, value]) => value !== '')
        );

        setErrors(filteredErrors);

        if (Object.keys(filteredErrors).length > 0) {
            showErrorMessage('Please correct the form errors');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await updateMe(formData);

            if (!res.success === true) {
                dispatch(updateFailure(res.message));
                showErrorMessage(res.message);
            } else {
                dispatch(updateSuccess(res.user));
                showSuccessMessage("Profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure((error as Error).message));
            showErrorMessage((error as Error).message);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const triggerDocumentFileInput = (docType: string) => {
        if (documentFileInputRef.current) {
            documentFileInputRef.current.setAttribute('data-doc-type', docType);
            documentFileInputRef.current.click();
        }
    };

    const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const docType = e.target.getAttribute('data-doc-type');
        if (docType) {
            handleDocumentUpload(e, docType);
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Profile
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>

                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => setTabs('profile')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'profile' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser />
                                Profile
                            </button>
                        </li>
                        {currentUser?.role === 'restaurant-admin' && (
                            <li className="inline-block">
                                <button
                                    onClick={() => setTabs('restaurant')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'restaurant' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Restaurant
                                </button>
                            </li>
                        )}
                        {currentUser?.role === 'delivery-person' && (
                            <li className="inline-block">
                                <button
                                    onClick={() => setTabs('vehicle')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'vehicle' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconWheel />
                                    Vehicle
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                {tabs === 'profile' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Personal Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {tabs === 'restaurant' && currentUser?.role === 'restaurant-admin' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Restaurant Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Restaurant Logo Upload */}
                            <div className="sm:col-span-2 mb-5">
                                <label className="block mb-2">Restaurant Logo</label>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                                        {logoPreview ? (
                                            <img src={logoPreview || "/placeholder.svg"} alt="Restaurant Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <IconHome className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="btn btn-outline-primary"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Logo'}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 200x200px</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, 'logo')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="restaurantName">Restaurant Name</label>
                                <input
                                    id="restaurantName"
                                    name="restaurantName"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                />
                                {errors.restaurantName && <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantPhone">Restaurant Phone</label>
                                <input
                                    id="restaurantPhone"
                                    name="restaurantPhone"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantPhone}
                                    onChange={handleChange}
                                />
                                {errors.restaurantPhone && <p className="text-red-500 text-sm mt-1">{errors.restaurantPhone}</p>}
                            </div>
                            {/* Restaurant address fields */}
                            <div>
                                <label htmlFor="restaurantAddress.street">Street</label>
                                <input
                                    id="restaurantAddress.street"
                                    name="restaurantAddress.street"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.street}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.street && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.street}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.city">City</label>
                                <input
                                    id="restaurantAddress.city"
                                    name="restaurantAddress.city"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.city}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.city && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.city}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.state">State</label>
                                <input
                                    id="restaurantAddress.state"
                                    name="restaurantAddress.state"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.state}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.state && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.state}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.zipCode">Zip Code</label>
                                <input
                                    id="restaurantAddress.zipCode"
                                    name="restaurantAddress.zipCode"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.zipCode}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.zipCode && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.zipCode}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.country">Country</label>
                                <input
                                    id="restaurantAddress.country"
                                    name="restaurantAddress.country"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.country}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.country && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.country}</p>}
                            </div>
                            <div>
                                <label htmlFor="openingHours">Opening Hours</label>
                                {formData.openingHours.map((hour, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="time"
                                            value={hour.open}
                                            onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                                            className="form-input"
                                        />
                                        <input
                                            type="time"
                                            value={hour.close}
                                            onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                ))}
                                {errors.openingHours && <p className="text-red-500 text-sm mt-1">{errors.openingHours}</p>}
                            </div>

                            <div className="sm:col-span-2">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {tabs === 'vehicle' && currentUser?.role === 'delivery-person' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Vehicle Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Profile Picture Upload */}
                            <div className="sm:col-span-2 mb-5">
                                <label className="block mb-2">Profile Picture</label>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                                        {profilePicturePreview ? (
                                            <img src={profilePicturePreview || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <IconUser className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="btn btn-outline-primary"
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Photo'}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 200x200px</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, 'profilePicture')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    className="form-select"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="bike">Bike</option>
                                    <option value="three-wheeler">Three Wheeler</option>
                                </select>
                                {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                            </div>
                            <div>
                                <label htmlFor="vehicleNumber">Vehicle Number</label>
                                <input
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    type="text"
                                    className="form-input"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                />
                                {errors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>}
                            </div>
                            <div>
                                <label htmlFor="licenseNumber">License Number</label>
                                <input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    type="text"
                                    className="form-input"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                />
                                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                            </div>

                            {/* Document Uploads */}
                            <div className="sm:col-span-2 mt-4">
                                <h6 className="text-md font-semibold mb-3">Documents</h6>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {['license', 'insurance', 'vehicle-registration'].map((docType) => (
                                        <div key={docType} className="border border-gray-200 rounded-md p-4">
                                            <h6 className="font-medium mb-2 capitalize">{docType.replace('-', ' ')}</h6>
                                            <div className="h-40 mb-3 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                                                {documentPreviews[docType] ? (
                                                    <img src={documentPreviews[docType] || "/placeholder.svg"} alt={docType} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <IconFile className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                                        <p className="text-xs text-gray-500">No document uploaded</p>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => triggerDocumentFileInput(docType)}
                                                className="btn btn-sm btn-outline-primary w-full"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? 'Uploading...' : documentPreviews[docType] ? 'Update Document' : 'Upload Document'}
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        ref={documentFileInputRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        data-doc-type=""
                                        onChange={handleDocumentFileChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 mt-4">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AccountSetting;
