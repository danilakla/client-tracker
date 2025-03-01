import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const parentApi = {
    getSubjects(authToken: string) {
        return instance.get('/parent/get/class-groups', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTableOfSubgroup(authToken: string, idHold: number) {
        return instance.get(`/parent/show/table/${idHold}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}

