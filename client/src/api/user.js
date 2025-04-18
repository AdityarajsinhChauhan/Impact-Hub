import axios from '../utils/axios';

export const getUser = async (passion) => {
    try{
        const response = await axios.get('/user');
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getUserByEmail = async (email) => {
    try{
        const response = await axios.get(`/user/${email}`);
        console.log(response.data);
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const updateUserInterests = async (interests) => {
    try {
        const response = await axios.put('/user/update-interests', { interests });
        return response.data;
    } catch (err) {
        console.error('Error updating interests:', err);
        throw err;
    }
}

export const updateUserProfile = async (userData) => {
    try {
        const response = await axios.put('/user/update-profile', userData);
        return response.data;
    } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
    }
}
