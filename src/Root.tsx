import { Navigate, Route, Routes } from "react-router";
import './App.css';
import { FC } from "react";
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { PrivateRoute } from "./private-route";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { Example } from "./screens/roles/example";

export const urls = {
  logInUser: '/log-in/user',
  logInParent: '/log-in/parent',
  signUp: '/sign-up',
};

type RootProps = {};

export const Root: FC<RootProps> = () => {
  const { user } = useTypedSelector(state => state.user);

  return (
    <Routes>
      <Route path={urls.logInUser} element={<Login typeOfLogin='other' />} />
      <Route path={urls.logInParent} element={<Login typeOfLogin='parent' />} />
      <Route path={urls.signUp} element={<Signup/>} />
      <Route index element={<Example/>} />
      {/* <Route index element={<PrivateRoute />} >
        {user.role === 'ROLE_ADMIN' && <>
          
        </>}
        {user.role === 'ROLE_DEAN' && <>
          
          </>}
        {user.role === 'ROLE_PARENT' && <>
        
        </>}
        {user.role === 'ROLE_STUDENT' && <>
        
        </>}
        {user.role === 'ROLE_TEACHER' && <>
        
        </>}
        <Route index element={<>{user.role}</>} />
      </Route> */}
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};