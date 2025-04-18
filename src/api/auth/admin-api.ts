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
    getMembers(authToken: string) {
        return instance.get('/admin/members/get', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    recoverPassword(authToken: string, id: number) {
        return instance.post(`/user/recovery-password/${id}`, null, { 
            headers: {'Authorization' : `Bearer ${authToken}`}, 
        }).then((response) => {
                return response.data;
        })
    },

    deleteDean(authToken: string, deanId: number, newDeanId: number) {
        return instance.delete(`/admin/delete/dean`, { 
            headers: { 'Authorization': `Bearer ${authToken}` },
            data: { deanId, newDeanId } 
        }).then((response) => {
            return response.data;
        });
    },
    deleteTeacher(authToken: string, teacherId: number, newTeacherId: number) {
        return instance.delete(`/admin/delete/teacher`, { 
            headers: { 'Authorization': `Bearer ${authToken}` },
            data: { teacherId, newTeacherId } 
        }).then((response) => {
            return response.data;
        });
    },
}