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
    generateStudents(authToken: string, students: {
        name: string;
        lastname: string;
        surname: string;
        numberOfGroup: string;
        specialty: string;
        date: Date;
    }[]) {
        return instance.post(`/dean/generate-student`, students, {
            headers: { 'Authorization': `Bearer ${authToken}` },
            responseType: 'blob', 
        })
        .then((response) => {
            return response.data; 
        });
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
    getClassGroupDetails(authToken: string, id: number) {
        return instance.get(`/dean/get/class-group/${id}`, { 
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
    getSubgroups(authToken: string) {
        return instance.get('/dean/subgroup/get', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createClassGroup(authToken: string, teacherId: number, subjectId: number, formatClassId: number, description: string){
        return instance.post('/dean/class-group/create',{
            teacherId: teacherId,
            subjectId: subjectId,
            formatClassId: formatClassId,
            description: description
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateClassGroup(
        authToken: string, 
        teacherId: string, 
        classGroupId: string, 
        subjectId: string, 
        classFormatId: string, 
        description: string,
        hasApplyAttestation: boolean
    ){
        return instance.put('/dean/class-group/update',{
            teacherId: teacherId,
            classGroupId: classGroupId,
            subjectId: subjectId,
            classFormatId: classFormatId,
            description: description,
            hasApplyAttestation: hasApplyAttestation
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    assignGroupToClassGroup(authToken: string, classGroupId: number, isMany: boolean, hasApplyAttestation: boolean, studentGroupIds: number[]){
        return instance.post('/dean/assign/groups',{
            classGroupId: classGroupId,
            studentGroupIds: studentGroupIds,
            hasApplyAttestation: hasApplyAttestation,
            isMany: isMany
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    addGroupToClassGroup(authToken: string, classGroupId: number, studentGroupIds: number[], hasApplyAttestation: boolean, isMany: boolean){
        return instance.post('/dean/add/groups-to-class',{
            classGroupId: classGroupId,
            studentGroupIds: studentGroupIds,
            hasApplyAttestation: hasApplyAttestation,
            isMany: isMany
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    removeGroupToClassGroup(authToken: string, classGroupId: number, studentGroupIds: number[]){
        return instance.post('/dean/remove/groups-from-class',{
            classGroupId: classGroupId,
            studentGroupIds: studentGroupIds
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteClassGroup(authToken: string, id: number) {
        return instance.delete(`/dean/class-group/delete/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    deleteSubgroup(authToken: string, id: number) {
        return instance.delete(`/dean/delete/subgroup/${id}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    startAttestation(authToken: string, time: number){
        return instance.post('/attestation',{
            time: time
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getTeachersNotAttessted(authToken: string) {
        return instance.get('/attestation/notify-dean', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getStudentsNotAttessted(authToken: string) {
        return instance.get('/dean/not-attested/students', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getStatisticsExcel(authToken: string) {
        return instance.post('/dean/generate/info/course', null, { 
            headers: { 'Authorization': `Bearer ${authToken}` },
            responseType: 'blob'
        }).then((response) => {
            return response.data;
        });
    },
    getClassGroupTable(authToken: string, holdId: number) {
        return instance.get(`/dean/show/table/${holdId}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getClassGroupsBySubgroups(authToken: string) {
        return instance.get('/dean/pre/show/table', { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    reassignStudent(authToken: string, studentsId: number, subgroupId: number){
        return instance.put('/dean/reassign/students',{
            studentsId: [studentsId],
            subgroupId: subgroupId
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
}