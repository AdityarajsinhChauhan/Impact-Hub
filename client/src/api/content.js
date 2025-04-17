import axios from "../utils/axios";

export const getContent = async () => {
    try{
        const res = await axios.get("/content");
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const addContent = async (content) => {
    try{
        const res = await axios.post("/content", content);
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const deleteContent = async (id) => {
    try{
        const res = await axios.delete(`/content/${id}`);
            return res.data;
    } catch (err) {
        return err.response.data;
    }
}

export const updateContent = async (id, content) => {
    try{
        const res = await axios.put(`/content/${id}`, content);
        return res.data;
    } catch (err) {
        return err.response.data;
    }
}   
