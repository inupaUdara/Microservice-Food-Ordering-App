import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, FieldArrayWithId } from 'react-hook-form';
import { createMenu } from '../../../../services/restaurant/restaurant';
import { useParams } from 'react-router-dom';

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
    description?: string;
    category: string;
    price: number;
    image?: FileList;
    availability: boolean;
    ingredients: string[];
    dietaryTags: string[];
    customizations: Customization[];
    preparationTime: number;
    isVeg: boolean;
    spicyLevel: 'Mild' | 'Medium' | 'Hot';
}

const dietaryTagOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'];

const CreateMenus: React.FC = () => {
    const { id } = useParams();
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, control, reset, watch, setValue } = useForm<FormData>();
    ({
        defaultValues: {
            customizations: [],
            ingredients: [],
            dietaryTags: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'customizations',
    });

    const onSubmit = async (data: FormData) => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('restaurantId', id!);

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'image' && value instanceof FileList && value[0]) {
                    formData.append('image', value[0]);
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            const result = await createMenu(id, formData);
            console.log('Menu Created:', result);
            reset();
        } catch (error) {
            console.error('Failed to create menu', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create New Menu Item</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <input {...register('name', { required: true })} placeholder="Name" className="input" />
                    <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" className="input" />
                    <input {...register('description')} placeholder="Description" className="input col-span-2" />
                    <select {...register('category', { required: true })} className="input">
                        <option value="">Select Category</option>
                        {['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides'].map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <input type="file" {...register('image')} className="input" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input {...register('preparationTime')} type="number" placeholder="Preparation Time (mins)" className="input" />
                    <select {...register('spicyLevel')} className="input">
                        {['Mild', 'Medium', 'Hot'].map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register('isVeg')} /> Vegetarian
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register('availability')} /> Available
                    </label>
                </div>

                <div>
                    <label>Ingredients (comma separated)</label>
                    <input
                        className="input"
                        placeholder="e.g. chicken, onions, garlic"
                        onBlur={(e) =>
                            setValue(
                                'ingredients',
                                e.target.value.split(',').map((v) => v.trim())
                            )
                        }
                    />
                </div>

                <div>
                    <label>Dietary Tags</label>
                    <div className="flex gap-4 flex-wrap">
                        {dietaryTagOptions.map((tag) => (
                            <label key={tag} className="flex items-center gap-2">
                                <input type="checkbox" value={tag} {...register('dietaryTags')} />
                                {tag}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">Customizations</h3>
                    {fields.map((item: FieldArrayWithId<FormData, 'customizations', 'id'>, index: number) => (
                        <div key={item.id} className="border p-4 mb-4 rounded-md space-y-2">
                            <input placeholder="Customization Name" {...register(`customizations.${index}.name`, { required: true })} className="input" />
                            <select {...register(`customizations.${index}.type`)} className="input">
                                <option value="">Select Type</option>
                                {['dropdown', 'checkbox', 'radio'].map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            <Controller
                                control={control}
                                name={`customizations.${index}.options`}
                                render={({ field }: { field: { onChange: (value: CustomizationOption[]) => void } }) => (
                                    <textarea
                                        placeholder="Options (e.g. Small:0, Medium:1)"
                                        onBlur={(e) => {
                                            const options = e.target.value.split(',').map((opt) => {
                                                const [label, price = '0'] = opt.split(':').map((s) => s.trim());
                                                return { label, price: Number(price) };
                                            });
                                            field.onChange(options);
                                        }}
                                        className="input"
                                    />
                                )}
                            />
                            <button type="button" onClick={() => remove(index)} className="text-red-500">
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => append({ name: '', type: 'dropdown', options: [] })} className="btn">
                        + Add Customization
                    </button>
                </div>

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Menu'}
                </button>
            </form>
        </div>
    );
};

export default CreateMenus;
