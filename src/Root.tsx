import { Navigate, Route, Routes } from "react-router";
import './App.css';
import { FC } from "react";
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { PrivateRoute } from "./private-route";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { Profile } from "./screens/roles/general/profile-parent/profile";
import { ChangeAccoundData } from "./screens/roles/general/profile-parent/change-accound-data";
import { ChangePassword } from "./screens/roles/general/profile-parent/change-password";
import { ChangeLogin } from "./screens/roles/general/profile-parent/change-login";
import { UniversityInfo } from "./screens/roles/general/profile-parent/university-info";
import { Workshop as AdminWorkShop } from "./screens/roles/admin/workshop-parent/workshop";
import { GeneratorKeys as AdminGeneratorKeys } from "./screens/roles/admin/workshop-parent/generator-keys";
import { UniversityEditor as AdminUniversityEditor } from "./screens/roles/admin/workshop-parent/university-editor";
import { Members as AdminMembers } from "./screens/roles/admin/workshop-parent/members";

import { Workshop as DeanWorkshop } from "./screens/roles/dean/workshop-parent/workshop";
import { ClassFormats as DeanClassFormats } from "./screens/roles/dean/workshop-parent/class-formats";
import { Specialties as DeanSpecialties } from "./screens/roles/dean/workshop-parent/specialties";
import { GenerateStudents as DeanGenerateStudents } from "./screens/roles/dean/workshop-parent/generate-students";
import { Students as DeanStudents } from "./screens/roles/dean/workshop-parent/students";
import { ControlSubjects as DeanControlSubjects } from "./screens/roles/dean/workshop-parent/subjects-parent/control-subjects";
import { ClassGroupsDetails as DeanClassGroupsDetails } from "./screens/roles/dean/workshop-parent/subjects-parent/class-groups-details";
import { ClassGroups as DeanClassGroups } from "./screens/roles/dean/workshop-parent/subjects-parent/class-groups";

import { Attestation as DeanAttestation  } from "./screens/roles/dean/workshop-parent/attestation-parent/attestation";
import { AttestationStart as DeanAttestationStart  } from "./screens/roles/dean/workshop-parent/attestation-parent/attestation-start";
import { AttestationStudents as DeanAttestationStudents  } from "./screens/roles/dean/workshop-parent/attestation-parent/attestation-students";
import { AttestationTeachers as DeanAttestationTeachers  } from "./screens/roles/dean/workshop-parent/attestation-parent/attestation-teachers";

import { Subjects as TeacherSubjects } from "./screens/roles/teacher/subjects-parent/subjects";
import { ClassGroups as TeacherClassGroups } from "./screens/roles/teacher/subjects-parent/class-groups";
import { ClassGroupSubgroups as TeacherClassGroupSubgroups } from "./screens/roles/teacher/subjects-parent/class-group-subgroups";

import { StudentSubjects } from "./screens/roles/parent-and-student/student-subjects";
import { StudentClassGroups } from "./screens/roles/parent-and-student/student-class-groups";
import { StudentClassGroupTable } from "./screens/roles/parent-and-student/student-class-group-table";

export const urls = {
  logInUser: '/log-in/user',
  logInParent: '/log-in/parent',
  signUp: '/sign-up',

  profile: '/profile',
  profileUpdateAccountData: '/profile/update-account-data',
  profileUpdatePassword: '/profile/update-password',
  profileUpdateLogin: '/profile/update-login',
  profileUniversityInfo: '/profile/university',

  adminWorkshop: '/admin/workshop',
  adminGeneratorKeys: '/admin/workshop/generator-keys',
  adminUniversityEditor: '/admin/workshop/university-editor',
  adminMembers: '/admin/workshop/members',

  deanWorkshop: '/dean/workshop',
  deanClassFormats: '/dean/workshop/class-formats',
  deanSpecialities: '/dean/workshop/specialities',
  deanGenerateStudents: '/dean/workshop/generate-students',
  deanStudents: '/dean/workshop/students',
  deanSubjects: '/dean/workshop/subjects',
  deanClassGroups: '/dean/workshop/subjects/class-groups',
  deanClassGroupAdd: '/dean/workshop/subjects/class-group/add',
  deanClassGroupEdit: '/dean/workshop/subjects/class-group/edit',

  deanAttestation: '/dean/workshop/attestation',
  deanAttestationStart: '/dean/workshop/attestation/start',
  deanAttestationTeachers: '/dean/workshop/attestation/teachers',
  deanAttestationStudents: '/dean/workshop/attestation/students',

  teacherSubjects: '/teacher/subjects',
  teacherClassGroups: '/teacher/subjects/class-groups',
  teacherClassGroupSubgroups: '/teacher/subjects/class-group/subgroups',
  teacherClassGroupControl: '/teacher/subjects/class-groups-control',

  studentSubjects: '/student/subjects',
  studentClassGroups: '/student/subjects/class-groups',
  studentClassGroupTable: '/student/subjects/class-group/table',
  studentQrCodeScanner: '/student/scanner',
};

type RootProps = {};

export const Root: FC<RootProps> = () => {
  const { user } = useTypedSelector(state => state.user);

  return (
    <Routes>
      <Route path={urls.logInUser} element={<Login typeOfLogin='other' />} />
      <Route path={urls.logInParent} element={<Login typeOfLogin='parent' />} />
      <Route path={urls.signUp} element={<Signup/>} />

      <Route element={<PrivateRoute/>}>
        {/* General */}
        <Route path={urls.profile} element={<Profile/>}/>
        <Route path={urls.profileUniversityInfo} element={<UniversityInfo/>}/>
        

        {user.role === 'ROLE_ADMIN' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
            
          <Route path={urls.adminWorkshop} element={<AdminWorkShop/>}/>
          <Route path={urls.adminGeneratorKeys} element={<AdminGeneratorKeys/>}/>
          <Route path={urls.adminUniversityEditor} element={<AdminUniversityEditor/>}/>
          <Route path={urls.adminMembers} element={<AdminMembers/>}/>
          
        </>}
        {user.role === 'ROLE_DEAN' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.deanWorkshop} element={<DeanWorkshop/>}/>
          <Route path={urls.deanClassFormats} element={<DeanClassFormats/>}/>
          <Route path={urls.deanSpecialities} element={<DeanSpecialties/>}/>

          <Route path={urls.deanSubjects} element={<DeanControlSubjects/>}/>
          <Route path={urls.deanClassGroups} element={<DeanClassGroups/>}/>
          <Route path={urls.deanClassGroupAdd} element={<DeanClassGroupsDetails type='add' />}/>
          <Route path={urls.deanClassGroupEdit} element={<DeanClassGroupsDetails type='edit' />}/>


          <Route path={urls.deanAttestation} element={<DeanAttestation/>}/>
          <Route path={urls.deanAttestationStart} element={<DeanAttestationStart/>}/>
          <Route path={urls.deanAttestationStudents} element={<DeanAttestationStudents/>}/>
          <Route path={urls.deanAttestationTeachers} element={<DeanAttestationTeachers/>}/>

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
          <Route path={urls.deanGenerateStudents} element={<DeanGenerateStudents/>}/>
          <Route path={urls.deanStudents} element={<DeanStudents/>}/>
        </>}
        {user.role === 'ROLE_PARENTS' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profile} element={<Profile/>}/>
          <Route path={urls.profileUniversityInfo} element={<UniversityInfo/>}/>

          <Route path={urls.studentSubjects} element={<StudentSubjects role='ROLE_PARENTS' />} />
          <Route path={urls.studentClassGroups} element={<StudentClassGroups role='ROLE_PARENTS'/>} />
          <Route path={urls.studentClassGroupTable} element={<StudentClassGroupTable role='ROLE_PARENTS'/>} />
        </>}
        {user.role === 'ROLE_STUDENT' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>

          <Route path={urls.studentSubjects} element={<StudentSubjects role='ROLE_STUDENT'/>} />
          <Route path={urls.studentClassGroups} element={<StudentClassGroups role='ROLE_STUDENT'/>} />
          <Route path={urls.studentClassGroupTable} element={<StudentClassGroupTable role='ROLE_STUDENT'/>} />
        </>}
        {user.role === 'ROLE_TEACHER' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>

          <Route path={urls.teacherSubjects} element={<TeacherSubjects/>}/>
          <Route path={urls.teacherClassGroups} element={<TeacherClassGroups/>}/>
          <Route path={urls.teacherClassGroupSubgroups} element={<TeacherClassGroupSubgroups/>}/>
          {/* <Route path={urls.teacherClassGroupControl} element={<TeacherClassGroupPanel/>}/> */}
        </>}
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    </Routes>
  );
};