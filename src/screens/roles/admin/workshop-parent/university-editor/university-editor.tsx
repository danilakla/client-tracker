import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { UniversityEditorProps } from './university-editor.props';
import { UniversityEditorView } from './university-editor.view';
import { useWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { universityEditorSlice } from '../../../../../store/reducers/roles/admin/university-editor-slice';

export const UniversityEditor: FC<UniversityEditorProps> = memo(() => {
  
  const goToWorkshop = useWorkshop();

  const adminUniversityEditorState = useTypedSelector(state => state.adminUniversityEditor);

  const dispatch = useAppDispatch();

  const { 
    setNameUniversityActionCreater,
    setDescriptionUniversityActionCreater,
    reset
  } = universityEditorSlice.actions;

  const isInizialized = useRef(true);

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      console.log('set');
    } else return () => {
      console.log('cleared');
      dispatch(reset());
    };
  }, [dispatch,reset]);

  const setNameUniversity = useCallback((value: string) => {
    dispatch(setNameUniversityActionCreater(value));
  }, [dispatch, setNameUniversityActionCreater])

  const setDescriptionUniversity = useCallback((value: string) => {
    dispatch(setDescriptionUniversityActionCreater(value));
  }, [dispatch, setDescriptionUniversityActionCreater])

  const onSave = useCallback(() => {

  },[])

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
