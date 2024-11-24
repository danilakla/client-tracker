import axios from "axios"
import { Student } from "../../store/reducers/roles/dean/generate-students-slice";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

export const deanApi = {
    getClassFormats(authToken: string) {
        return instance.get('/dean/class-format/get/all', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createClassFormat(authToken: string, formatName: string, description: string){
        return instance.post('/dean/class-format/create',{
            formatName: formatName,
            description: description,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateClassFormat(authToken: string, id: number, formatName: string, description: string){
        return instance.put('/dean/class-format/put',{
            id: id,
            formatName: formatName,
            description: description,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteClassFormats(authToken: string, id: number) {
        return instance.delete(`/dean/class-format/delete/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getSpecialties(authToken: string) {
        return instance.get('/dean/specialty/get/all', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createSpecialty(authToken: string, name: string){
        return instance.post('/dean/specialty/create',{
            name: name,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateSpecialty(authToken: string, id: number, name: string){
        return instance.put('/dean/specialty/put',{
            id: id,
            name: name
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteSpecialty(authToken: string, id: number) {
        return instance.delete(`/dean/specialty/delete/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    generateStudents(authToken: string, students: Student[]) {
        return instance.post(`/dean/generate-student`, students ,{ 
            headers: {'Authorization' : `Bearer ${authToken}`} })
        .then((response) => {
            return response.data;
        })
    },
    getMembers(authToken: string) {
        return instance.get('/dean/members/get', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateStudent(authToken: string, id: number, lastname: string, name: string, surname: string){
        return instance.post(`/dean/students/update/${id}`,{
            lastname: lastname,
            name: name,
            surname: surname
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    recoveryPasswordForStudent(authToken: string, id: number){
        return instance.post(`/user/recovery-password/${id}`,null, 
            { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteStudent(authToken: string, id: number) {
        return instance.delete(`/user/delete/student/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createStudent(authToken: string, numberOfGroupId: string, lastname: string, name: string, surname: string){
        return instance.post(`/dean/students/create`,{
            lastname: lastname,
            name: name,
            surname: surname,
            numberOfGroupId: numberOfGroupId
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getSubjects(authToken: string) {
        return instance.get('/dean/subject/get/all', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createSubject(authToken: string, name: string, description: string){
        return instance.post(`/dean/subject/create`,{
            name: name,
            description: description,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getClassGroupsBySubject(authToken: string, id: number) {
        return instance.get(`/dean/get/class-groups/subject/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteSubject(authToken: string, id: number) {
        return instance.delete(`/dean/subject/delete/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateSubject(authToken: string, id: number, name: string, description: string){
        return instance.put(`/dean/subject/put`,{
            id: id,
            name: name,
            description: description,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTeachers(authToken: string) {
        return instance.get('/common/teachers', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}