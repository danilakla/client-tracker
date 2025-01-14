import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const studentApi = {
    getSubjects(authToken: string) {
        return instance.get('/student/get/class-groups', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTableOfSubgroup(authToken: string, idHold: number) {
        return instance.get(`/common/show/table/${idHold}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}

