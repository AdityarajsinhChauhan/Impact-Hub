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
