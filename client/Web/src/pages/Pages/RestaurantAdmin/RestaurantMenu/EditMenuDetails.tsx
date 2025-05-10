import type React from 'react';
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllMenuItems, updateMenu } from '../../../../services/restaurant/restaurant';
import { uploadImage, getImageById } from '../../../../services/upload/upload';
import Loader from '../../../Components/Loader';
import Swal from 'sweetalert2';
import { Clock, FileImage, Tag, ChefHat, Flame, Leaf, CheckCircle, PlusCircle, MinusCircle, Save, ArrowLeft, Info, Trash2, AlertTriangle } from 'lucide-react';

interface CustomizationOption {
    label: string;
    price: number;
}

interface Customization {
    name: string;
    type: 'dropdown' | 'checkbox' | 'radio';
    options: CustomizationOption[];
}

interface FormData {
    name: string;
    description: string;
    category: string;
    price: number;
    image?: File | string;
    availability: boolean;
    ingredients: string[];
    dietaryTags: string[];
    customizations: Customization[];
    preparationTime: number;
    isVeg: boolean;
    spicyLevel: 'Mild' | 'Medium' | 'Hot';
}

const dietaryTagOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'];
const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'];
const spicyLevels = ['Mild', 'Medium', 'Hot'];

const EditMenuDetails: React.FC = () => {
    const { id, menuId } = useParams<{ id: string; menuId: string }>();
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        category: '',
        price: 0,
        availability: true,
        ingredients: [],
        dietaryTags: [],
        customizations: [],
        preparationTime: 15,
        isVeg: false,
        spicyLevel: 'Mild',
    });

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
        const fetchMenuItem = async () => {
            try {
                const menuItems = await getAllMenuItems(id!);
                const menuItem = menuItems.find((item: any) => item._id === menuId);

                if (menuItem) {
                    let imageUrl = null;
                    if (menuItem.image) {
                        if (menuItem.image.startsWith('http')) {
                            imageUrl = menuItem.image;
                        } else {
                            try {
                                const imageData = await getImageById(menuItem.image);
                                imageUrl = imageData.url;
                                setError(null);
                            } catch (error) {
                                console.error('Error fetching image:', error);
                                setError('Failed to load image. Please try again later.');
                                showMessage('Failed to load image. Please try again later.', 'error');
                            }
                        }
                    }

                    setFormData({
                        name: menuItem.name,
                        description: menuItem.description || '',
                        category: menuItem.category,
                        price: menuItem.price,
                        availability: menuItem.availability,
                        ingredients: menuItem.ingredients || [],
                        dietaryTags: menuItem.dietaryTags || [],
                        customizations: menuItem.customizations || [],
                        preparationTime: menuItem.preparationTime || 15,
                        isVeg: menuItem.isVeg || false,
                        spicyLevel: menuItem.spicyLevel || 'Mild',
                        image: imageUrl,
                    });
                    setImagePreview(imageUrl);
                    setError(null);
                }
            } catch (error) {
                console.error('Error fetching menu item:', error);
                setError('Failed to load menu item. Please try again later.');
                showMessage('Failed to load menu item. Please try again later.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItem();
    }, [id, menuId]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleIngredientsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const ingredients = e.target.value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item);
        setFormData((prev) => ({ ...prev, ingredients }));
    };

    const handleDietaryTagChange = (tag: string, checked: boolean) => {
        setFormData((prev) => {
            const newTags = checked ? [...prev.dietaryTags, tag] : prev.dietaryTags.filter((t) => t !== tag);
            return { ...prev, dietaryTags: newTags };
        });
    };

    const handleCustomizationChange = (index: number, field: string, value: any) => {
        setFormData((prev) => {
            const newCustomizations = [...prev.customizations];
            newCustomizations[index] = { ...newCustomizations[index], [field]: value };
            return { ...prev, customizations: newCustomizations };
        });
    };

    const handleOptionChange = (customizationIndex: number, optionIndex: number, field: string, value: string) => {
        setFormData((prev) => {
            const newCustomizations = [...prev.customizations];
            const newOptions = [...newCustomizations[customizationIndex].options];

            newOptions[optionIndex] = {
                ...newOptions[optionIndex],
                [field]: field === 'price' ? Number(value) : value,
            };

            newCustomizations[customizationIndex].options = newOptions;
            return { ...prev, customizations: newCustomizations };
        });
    };

    const addCustomization = () => {
        setFormData((prev) => ({
            ...prev,
            customizations: [...prev.customizations, { name: '', type: 'dropdown', options: [] }],
        }));
    };

    const removeCustomization = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.filter((_, i) => i !== index),
        }));
    };

    const addOption = (customizationIndex: number) => {
        setFormData((prev) => {
            const newCustomizations = [...prev.customizations];
            newCustomizations[customizationIndex].options = [...newCustomizations[customizationIndex].options, { label: '', price: 0 }];
            return { ...prev, customizations: newCustomizations };
        });
    };

    const removeOption = (customizationIndex: number, optionIndex: number) => {
        setFormData((prev) => {
            const newCustomizations = [...prev.customizations];
            newCustomizations[customizationIndex].options = newCustomizations[customizationIndex].options.filter((_, i) => i !== optionIndex);
            return { ...prev, customizations: newCustomizations };
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            let uploadedImageUrl = formData.image;

            if (formData.image instanceof File) {
                const imageResponse = await uploadImage(formData.image);
                uploadedImageUrl = imageResponse?.url || imageResponse?.imageUrl || '';
            }

            const payload = {
                ...formData,
                image: uploadedImageUrl,
                restaurantId: id,
                price: Number(formData.price),
                preparationTime: Number(formData.preparationTime),
            };

            const result = await updateMenu(menuId!, payload);
            console.log('Menu Updated:', result);
            navigate('/menus');
            setError(null);
            showMessage('Menu updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update menu', error);
            setError('Failed to update menu. Please try again later.');
            showMessage('Failed to update menu. Please try again later.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;
    if (error)
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Menu Item</h3>
                    <p className="text-red-600">{error}</p>
                    <button onClick={() => navigate('/menus')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Back to Menus
                    </button>
                </div>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button onClick={() => navigate('/menus')} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        <span>Back to Menus</span>
                    </button>
                    <h2 className="text-3xl font-bold mt-2 text-gray-800">Edit Menu Item</h2>
                    <p className="text-gray-500">Update details for {formData.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                {/* Basic Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-emerald-500" />
                        Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all ${
                                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Menu item name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Price<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <h1 className=" text-gray-400">LKR.</h1>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="1.00"
                                    className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all ${
                                        errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                rows={3}
                                placeholder="Describe your dish, including flavors and special features"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Category<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all appearance-none bg-white ${
                                    errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-center">
                                    <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileImage className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                                {imagePreview && (
                                    <div className="mt-4 flex flex-col items-center">
                                        <div className="relative w-full max-w-xs">
                                            <img src={imagePreview || '/placeholder.svg'} alt="Preview" className="rounded-lg border border-gray-200 shadow-sm w-full h-auto max-h-48 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, image: undefined }));
                                                    setImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <MinusCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <Tag className="w-5 h-5 mr-2 text-emerald-500" />
                        Additional Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Preparation Time (minutes)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="preparationTime"
                                    value={formData.preparationTime}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Spicy Level</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Flame className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    name="spicyLevel"
                                    value={formData.spicyLevel}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all appearance-none bg-white"
                                >
                                    {spicyLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <input type="checkbox" id="isVeg" name="isVeg" checked={formData.isVeg} onChange={handleChange} className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400" />
                            <label htmlFor="isVeg" className="flex items-center cursor-pointer">
                                <Leaf className="w-5 h-5 mr-2 text-emerald-500" />
                                <span>Vegetarian</span>
                            </label>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                id="availability"
                                name="availability"
                                checked={formData.availability}
                                onChange={handleChange}
                                className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-400"
                            />
                            <label htmlFor="availability" className="flex items-center cursor-pointer">
                                <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                                <span>Available on Menu</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <ChefHat className="w-5 h-5 mr-2 text-emerald-500" />
                        Ingredients & Dietary Information
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Ingredients</label>
                            <div className="relative">
                                <input
                                    value={formData.ingredients.join(', ')}
                                    onChange={handleIngredientsChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="e.g., chicken, onions, garlic (comma separated)"
                                />
                            </div>
                            {formData.ingredients.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.ingredients.map((ingredient, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded">
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Dietary Tags</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {dietaryTagOptions.map((tag) => (
                                    <label
                                        key={tag}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                            formData.dietaryTags.includes(tag) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.dietaryTags.includes(tag)}
                                            onChange={(e) => handleDietaryTagChange(tag, e.target.checked)}
                                            className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400 mr-2"
                                        />
                                        <span className="capitalize">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customizations Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Customizations</h3>
                        <button type="button" onClick={addCustomization} className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors">
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Add Customization
                        </button>
                    </div>

                    {formData.customizations.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500">No customizations added yet</p>
                            <button
                                type="button"
                                onClick={addCustomization}
                                className="mt-2 inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600 transition-colors"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Your First Customization
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formData.customizations.map((customization, customizationIndex) => (
                                <div key={customizationIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                                        <h4 className="font-medium text-gray-700">Customization #{customizationIndex + 1}</h4>
                                        <button type="button" onClick={() => removeCustomization(customizationIndex)} className="text-red-500 hover:text-red-700 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                                    Name<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    value={customization.name}
                                                    onChange={(e) => handleCustomizationChange(customizationIndex, 'name', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="e.g., Size, Toppings"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-700">
                                                    Type<span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={customization.type}
                                                    onChange={(e) => handleCustomizationChange(customizationIndex, 'type', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all appearance-none bg-white"
                                                >
                                                    <option value="dropdown">Dropdown</option>
                                                    <option value="checkbox">Checkbox</option>
                                                    <option value="radio">Radio</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Options<span className="text-red-500">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(customizationIndex)}
                                                    className="text-xs flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
                                                >
                                                    <PlusCircle className="w-3 h-3 mr-1" />
                                                    Add Option
                                                </button>
                                            </div>

                                            {customization.options.length === 0 ? (
                                                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                                    <p className="text-sm text-gray-500">No options added yet</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(customizationIndex)}
                                                        className="mt-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
                                                    >
                                                        Add your first option
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {customization.options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className="flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                value={option.label}
                                                                onChange={(e) => handleOptionChange(customizationIndex, optionIndex, 'label', e.target.value)}
                                                                placeholder="Option label"
                                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                                            />
                                                            <div className="relative w-24">
                                                                {/* <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                                  
                                                                </div> */}
                                                                <input
                                                                    type="number"
                                                                    step="1"
                                                                    value={option.price}
                                                                    onChange={(e) => handleOptionChange(customizationIndex, optionIndex, 'price', e.target.value)}
                                                                    placeholder="Price"
                                                                    className="w-full pl-7 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 outline-none transition-all"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(customizationIndex, optionIndex)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <MinusCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/menus')} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
                            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 transition-colors'
                        }`}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Updating Menu...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Update Menu
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMenuDetails;
