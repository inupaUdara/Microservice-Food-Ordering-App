import api from '../axiosInstanceNoToken';

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await api.post('upload/api/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const updateImage = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await api.put(`upload/api/images/${id}`, formData, {
            // <-- Here corrected
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating image:', error);
        throw error;
    }
};

export const getImageById = async (id: string) => {
    try {
        const response = await api.get(`upload/api/images/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw error;
    }
};
