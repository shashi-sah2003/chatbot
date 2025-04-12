import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create()

api.interceptors.response.use(
    (response) => {
        console.log("Response:", response.headers); 
        const remaining = parseInt(response.headers["x-ratelimit-remaining"] || "5", 10);
        if (remaining <= 1) {
            toast("Heads up! You're almost out of requests. Try again soon if needed.", { icon: '⚠️', duration: 5000 });
        }
        return response
    },
    (error)=>{
        if(error.response && error.response.status === 429){
            const retryAfter = error.response.headers['retry-after'] || 60;
            toast.error(
                `Too many requests. Please wait ${retryAfter} seconds before trying again.`, 
                { duration: 5000}
            );
        }
        return Promise.reject(error);
    }
);

export default api;