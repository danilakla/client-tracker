import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { UniversityEditorProps } from './university-editor.props';
import { UniversityEditorView } from './university-editor.view';
import { useWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { changeUniversityInfoActionCreator, initializationUniversityInfoActionCreator, universityEditorSlice } from '../../../../../store/reducers/roles/admin/university-editor-slice';
import { useUser } from '../../../../../hooks/user-hook';

export const UniversityEditor: FC<UniversityEditorProps> = memo(() => {
  
  const goToWorkshop = useWorkshop();
  const {authToken} = useUser();

  const adminUniversityEditorState = useTypedSelector(state => state.adminUniversityEditor);

  const dispatch = useAppDispatch();

  const { 
    setNameUniversityActionCreater,
    setDescriptionUniversityActionCreater,
    reset
  } = universityEditorSlice.actions;

  const isInizialized = useRef(true);

  const initializationUniversityInfo = useCallback(()=>{
    dispatch(initializationUniversityInfoActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initializationUniversityInfo();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initializationUniversityInfo]);

  const setNameUniversity = useCallback((value: string) => {
    dispatch(setNameUniversityActionCreater(value));
  }, [dispatch, setNameUniversityActionCreater])

  const setDescriptionUniversity = useCallback((value: string) => {
    dispatch(setDescriptionUniversityActionCreater(value));
  }, [dispatch, setDescriptionUniversityActionCreater])

  const onSave = useCallback(() => {
    dispatch(changeUniversityInfoActionCreator({
      authToken: authToken,
      id: adminUniversityEditorState.university.idUniversity,
      name: adminUniversityEditorState.university.name,
      description: adminUniversityEditorState.university.description,
      onSuccess: goToWorkshop
    }))
  },[
    dispatch, 
    goToWorkshop,
    authToken, 
    adminUniversityEditorState.university.name, 
    adminUniversityEditorState.university.idUniversity,
    adminUniversityEditorState.university.description
  ])

  return (
      <UniversityEditorView 
        setNameUniversity={setNameUniversity}
        setDescriptionUniversity={setDescriptionUniversity}
        adminUniversityEditorState={adminUniversityEditorState}
        goToWorkshop={goToWorkshop}
        onSave={onSave}
        />
    );
});
