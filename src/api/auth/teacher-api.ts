import axios from "axios"
import { AttendanceCodeType } from "../../store/reducers/roles/teacher/class-group-control-slice";

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
    getTimeFromServer(authToken: string) {
        return instance.get('/time', { 
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
    getTableOfSubgroup(authToken: string, holdId: number) {
        return instance.get(`/teacher/show/table/${holdId}`, { 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    getSubgroupsByIds(authToken: string, ids: number[], classGroup: number) {
        return instance.post(`/common/subgroups-by-id`, {
            ids: ids,
            ClassGroup:classGroup
        },{ 
            headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createClass(authToken: string, holdId: number, studentship: number[]){
        return instance.post('/teacher/create/classes',{
            holdId: holdId,
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
    updateGrade(
        authToken: string, 
        idStudentGrate: number, 
        grade: number | null, 
        description: string | null, 
        attendance: AttendanceCodeType, 
        isPassLab: boolean){
        return instance.put('/teacher/update/classes',{
            idStudentGrate: idStudentGrate,
            grade: grade,
            description: description,
            attendance: attendance,
            isPassLab: isPassLab
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },

    saveKeyForQr(authToken: string, classId: number, expiration: number){
        return instance.post('/qr/teacher/save/key',{
            classId: classId,
            expiration: expiration,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    createQrCode(authToken: string, classId: number, expiration: number){
        return instance.post('/qr/teacher/start',{
            classId: classId,
            expiration: expiration,
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    startReviewForClass(authToken: string, classId: number){
        return instance.get('/qr/teacher/review/student', 
            { 
                params: {
                    classId: classId
                },
                headers: {'Authorization' : `Bearer ${authToken}`} 
            })
            .then((response) => {
                return response.data;
            })
    },
    calculateAttestation(
        authToken: string,
        maxLabCount: number,
        holdId: number,
        classId: number,
        countClassThatNotAttestation: number,
        timeOfOneClass: number,
        studentId: number[]
    ){
        return instance.post('/teacher/calculate/avg/attestation',{
            maxLabCount,
            holdId,
            classId,
            countClassThatNotAttestation,
            timeOfOneClass,
            studentId
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateAttestationGrade(
        authToken: string, 
        idAttestationStudentGrades: number,
        avgGrade: number | null,
        hour: number | null,
        currentCountLab :number | null,
        maxCountLab: number | null,
        isAttested: boolean,
    ){
        return instance.put('/teacher/update/attestation/classes',{
            idAttestationStudentGrades,
            avgGrade,
            maxCountLab,
            hour,
            currentCountLab,
            isAttested
            }, { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    notifyTeacherAttestation(
        authToken: string, 
        isHold: number
    ){
        return instance.get(`/attestation/notify-teacher/${isHold}`, 
            { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    removeAttestation(
        authToken: string, 
        idAttestation: number
    ){
        return instance.delete(`/attestation/remove/${idAttestation}`, 
            { headers: {'Authorization' : `Bearer ${authToken}`} })
            .then((response) => {
                return response.data;
            })
    },
    updateNameOfClass(
        authToken: string, 
        className: string | null,
        classId: number
    ){
        return instance.put(`/teacher/update/class/${classId}`, { className }, { 
                headers: {'Authorization' : `Bearer ${authToken}`} 
            })
            .then((response) => {
                return response.data;
            })
    },
}


