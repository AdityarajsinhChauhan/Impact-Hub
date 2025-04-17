import axios from '../utils/axios';

export const addPassion = async (passion) => {
    try{
        const response = await axios.post('/passion',{passion});
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const fetchPassion = async () => {
    try{
        const response = await axios.get('/passion');
        return response.data.passion;
    }catch(err){
        console.log(err);
    }
}