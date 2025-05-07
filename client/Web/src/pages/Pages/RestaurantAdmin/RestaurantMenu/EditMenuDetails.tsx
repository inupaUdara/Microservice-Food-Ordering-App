import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllMenuItems, updateMenu } from '../../../../services/restaurant/restaurant';
import { uploadImage, getImageById } from '../../../../services/upload/upload';
import Loader from '../../../Components/Loader';
import Swal from 'sweetalert2';

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
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Edit Menu Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name*</label>
                        <input name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`} placeholder="Menu item name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Price*</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : ''}`}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="Item description" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category*</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}>
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
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded" />
                        {imagePreview && (
                            <div className="mt-2">
                                <img src={imagePreview} alt="Preview" className="mt-2 max-h-48 rounded border" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Preparation Time (minutes)</label>
                        <input type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} min="0" className="w-full p-2 border rounded" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Spicy Level</label>
                        <select name="spicyLevel" value={formData.spicyLevel} onChange={handleChange} className="w-full p-2 border rounded">
                            {spicyLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} className="mr-2" />
                        <label>Vegetarian</label>
                    </div>

                    <div className="flex items-center">
                        <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} className="mr-2" />
                        <label>Available</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ingredients</label>
                    <input
                        onChange={handleIngredientsChange}
                        value={formData.ingredients.join(', ')}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., chicken, onions, garlic (comma separated)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Dietary Tags</label>
                    <div className="flex flex-wrap gap-4">
                        {dietaryTagOptions.map((tag) => (
                            <label key={tag} className="flex items-center space-x-2">
                                <input type="checkbox" checked={formData.dietaryTags.includes(tag)} onChange={(e) => handleDietaryTagChange(tag, e.target.checked)} />
                                <span>{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Customizations</h3>

                    {formData.customizations.map((customization, customizationIndex) => (
                        <div key={customizationIndex} className="border p-4 rounded-lg space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Customization Name*</label>
                                <input
                                    value={customization.name}
                                    onChange={(e) => handleCustomizationChange(customizationIndex, 'name', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g., Size, Toppings"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Type*</label>
                                <select value={customization.type} onChange={(e) => handleCustomizationChange(customizationIndex, 'type', e.target.value)} className="w-full p-2 border rounded">
                                    <option value="">Select Type</option>
                                    {['dropdown', 'checkbox', 'radio'].map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Options*</label>
                                {customization.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={option.label}
                                            onChange={(e) => handleOptionChange(customizationIndex, optionIndex, 'label', e.target.value)}
                                            placeholder="Option label"
                                            className="flex-1 p-2 border rounded"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={option.price}
                                            onChange={(e) => handleOptionChange(customizationIndex, optionIndex, 'price', e.target.value)}
                                            placeholder="Price"
                                            className="w-24 p-2 border rounded"
                                        />
                                        <button type="button" onClick={() => removeOption(customizationIndex, optionIndex)} className="text-red-500 hover:text-red-700">
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addOption(customizationIndex)} className="text-blue-500 hover:text-blue-700 text-sm">
                                    + Add Option
                                </button>
                            </div>

                            <button type="button" onClick={() => removeCustomization(customizationIndex)} className="text-red-500 hover:text-red-700 text-sm">
                                Remove Customization
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addCustomization} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        + Add Customization
                    </button>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={submitting} className={`w-full md:w-auto px-6 py-2 rounded-md text-white ${submitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}>
                        {submitting ? 'Updating Menu...' : 'Update Menu'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMenuDetails;
