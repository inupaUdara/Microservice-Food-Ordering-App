import api from '../axiosInstanceNoToken';

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await api.post('/upload/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
