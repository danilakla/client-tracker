import axios from "axios"
import { Student } from "../../store/reducers/roles/dean/generate-students-slice";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const teacherApi = {
    getSubjects(authToken: string) {
        return instance.get('/teacher/get/class-groups', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getClassGroupSubgroups(authToken: string, id: number) {
        return instance.get(`/teacher/get/class-groups/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTableOfSubgroup(authToken: string, idClassGroup: number, idSubgroup: number) {
        return instance.get(`/common/show/table/${idSubgroup}/${idClassGroup}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getSubgroupsByIds(authToken: string, ids: number[]) {
        return instance.post(`/common/subgroups-by-id`, {
            ids: ids
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createClass(authToken: string, classGroupToSubgroupId: number, studentship: number[]){
        return instance.post('/teacher/create/classes',{
            classGroupToSubgroupId: classGroupToSubgroupId,
            studentship: studentship
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteClass(authToken: string, id: number) {
        return instance.delete(`/teacher/delete/class/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateGrade(authToken: string, idStudentGrate: number, grade: number, description: string, attendance: 0 | 1 | 2 | 3){
        return instance.put('/teacher/update/classes',{
            idStudentGrate: idStudentGrate,
            grade: grade,
            description: description,
            attendance: attendance
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}

