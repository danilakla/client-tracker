import { combineReducers } from "redux";
import loginReducer from "./auth/login-slice";
import singupReducer from "./auth/singup-slice";
import userReducer from "./user-slice"
import appStatusReducer from "./app-status-slice"

import changeAccountReducer from "./profile/change-account-data-slice"
import changeLoginReducer from "./profile/change-login-slice"
import changePasswordReducer from "./profile/change-password-slice"
import universityInfoReducer from "./profile/university-info-slice"

import adminGeneratorKeysReducer from "./roles/admin/generator-keys-slice"
import adminUniversityEditorReducer from "./roles/admin/university-editor-slice"
import adminMembersReducer from "./roles/admin/members-slice"

import deanClassFormatsReducer from "./roles/dean/class-formats-slice"
import deanSpecialtiesReducer from "./roles/dean/specialties-slice"
import deanGenerateStudentsReducer from "./roles/dean/generate-students-slice"
import deanStudentsReducer from "./roles/dean/students-slice"

import deanClassGroupDetailsReducer from "./roles/dean/subjects-parent/class-group-details-slice"
import deanClassGroupsReducer from "./roles/dean/subjects-parent/class-groups-slice"
import deanControlSubjectsReducer from "./roles/dean/subjects-parent/control-subjects-slice"

import teacherSubjectsReducer from "./roles/teacher/subjects-slice"
import teacherClassGroupsReducer from "./roles/teacher/class-groups-slice"
import teacherClassGroupControlReducer from "./roles/teacher/class-group-control-slice"
import teacherClassGroupSubroupsReducer from "./roles/teacher/class-group-subroups-slice"

// import Reducer from "./roles/dean"

export const rootReducers = combineReducers({
      singup: singupReducer,
      login: loginReducer,
      user: userReducer,
      appStatus: appStatusReducer,
      changeAccountData: changeAccountReducer,
      changeLogin: changeLoginReducer,
      changePassword: changePasswordReducer,
      universityInfo: universityInfoReducer,
      adminGeneratorKeys: adminGeneratorKeysReducer,
      adminUniversityEditor: adminUniversityEditorReducer,
      adminMembers: adminMembersReducer,
      deanClassFormats: deanClassFormatsReducer,
      deanControlSubjects: deanControlSubjectsReducer,
      deanSpecialties: deanSpecialtiesReducer,
      deanGenerateStudents: deanGenerateStudentsReducer,
      deanStudents: deanStudentsReducer,
      deanClassGroupDetails: deanClassGroupDetailsReducer,
      deanClassGroups: deanClassGroupsReducer,
      teacherSubjects: teacherSubjectsReducer,
      teacherClassGroups: teacherClassGroupsReducer,
      teacherClassGroupControl: teacherClassGroupControlReducer,
      teacherClassGroupSubroups: teacherClassGroupSubroupsReducer
});

export type RootState = ReturnType<typeof rootReducers>;