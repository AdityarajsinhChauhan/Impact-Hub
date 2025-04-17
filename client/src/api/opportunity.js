import axios from '../utils/axios';

export const getOpportunities = async () => {
    try {
      const res = await axios.get("/opportunities");
      return(res.data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    }
  };

  export const saveOpportunity = async (opportunity) => {
    try {
        const res = await axios.post("/opportunities", opportunity); // <== REMOVE the {}
        return res.data;
    } catch (error) {
        console.error("Failed to save opportunity:", error);
    }
}

