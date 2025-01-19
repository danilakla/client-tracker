import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { GeneratorKeysProps } from './generator-keys.props';
import { GeneratorKeysView } from './generator-keys.view';
import { useWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { ItemOfSelectType } from '../../../../../ui-kit/select/select';
import { generateKeyActionCreator, generatorKeysSlice } from '../../../../../store/reducers/roles/admin/generator-keys-slice';
import { useUser } from '../../../../../hooks/user-hook';

export const GeneratorKeys: FC<GeneratorKeysProps> = memo(() => {
  
  const goToWorkshop = useWorkshop();

  const adminGeneratorKeysState = useTypedSelector(state => state.adminGeneratorKeys);

  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const { 
    setRoleActionCreater,
    setFacultyNameActionCreater,
    reset
  } = generatorKeysSlice.actions;

  const setRole = useCallback((role: ItemOfSelectType) => {
    dispatch(reset());
    dispatch(setRoleActionCreater(role));
  }, [dispatch, setRoleActionCreater, reset])

  const isInizialized = useRef(true);

  const setFacultyName = useCallback((value: string) => {
    dispatch(setFacultyNameActionCreater(value));
  }, [dispatch, setFacultyNameActionCreater]);

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch,reset]);

  const onCreate = useCallback(() => {
    dispatch(generateKeyActionCreator({
      authToken: authToken,
      role: adminGeneratorKeysState.role.value,
      faculty: adminGeneratorKeysState.facultyName
    }));
  },[
    dispatch, 
    authToken, 
    adminGeneratorKeysState.role.value, 
    adminGeneratorKeysState.facultyName
  ])

  return (
      <GeneratorKeysView 
        setRole={setRole}
        onCreate={onCreate}
        setFacultyName={setFacultyName}
        adminGeneratorKeysState={adminGeneratorKeysState}
        goToWorkshop={goToWorkshop}
        />
    );
});
