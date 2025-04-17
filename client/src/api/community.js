import axios from "../utils/axios";

export const getDiscussions = async () => {
    try{
        const res = await axios.get("/discussions");
        return res.data;
    }
    catch(error){
        return error.response.data;
    }

}

export const createDiscussion = async (discussion) => {
    try{
        const res = await axios.post("/discussions", discussion);
        return res.data;
    }
    catch(error){
        return error.response.data;
    }
}

export const getDiscussionById = async (id) => {
    try{
        const res = await axios.get(`/discussions/${id}`);
        return res.data;
    }
    catch(error){
        return error.response.data;
    }
}   
