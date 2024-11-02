import axios from "axios"

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const adminApi = {
    generateTeacher(authToken: string) {
        return instance.post('/admin/teacher/key', {
            roleName: "TEACHER",
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`},
        }).then((response) => {
            return response.data;
        })
    },
    generateDean(authToken: string, faculty: string) {
        return instance.post('/admin/dean/key', {
            roleName: "DEAN",
            faculty: faculty
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`}, 
        }).then((response) => {
                return response.data;
        })
    },
}