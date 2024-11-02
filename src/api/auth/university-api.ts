import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const universityApi = {
    getUniversityInfo(authToken: string) {
        return instance.get('/admin/university/get', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    changeUniversityInfo(authToken: string, id: number, name: string, description: string){
        return instance.post('/admin/university/update',{
            name: name,
            id: id,
            description: description
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}