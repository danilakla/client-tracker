import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassTableProps } from './class-table.props';
import { ClassTableView } from './class-table.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { classGroupTableSlice, GradeInfo, initDeanClassTableActionCreator, reloadDeanClassTableActionCreator } from '../../../../../store/reducers/roles/dean/class-group-table-slice';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { useNavigate } from 'react-router-dom';

export const ClassTable: FC<ClassTableProps> = memo(() => {

  const deanClassGroupTableState = useTypedSelector(state => state.deanClassGroupTable);
  
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToWorkshop= useDeanWorkshop();
  
  const isInizialized = useRef(true);

  const { 
    reset,
    setSelectedGradeInfoActionCreator
  } = classGroupTableSlice.actions;
  
  const initTableData = useCallback(()=>{
    dispatch(initDeanClassTableActionCreator({
      authToken: authToken, 
      initData: deanClassGroupTableState.initData
    }));
  },[
    deanClassGroupTableState.initData,
    dispatch,
    authToken
  ])
  
  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initTableData();
    } 
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initTableData]);

  useEffect(() => {
    if(deanClassGroupTableState.initData === null){
      goToWorkshop();
    }
  },[deanClassGroupTableState.initData, goToWorkshop])
  
  const navigate = useNavigate();
  const onBack = useCallback(() => {
    navigate(-1);
  },[navigate])

  const reloadDeanClassTable = useCallback(()=>{
      dispatch(reloadDeanClassTableActionCreator({
        authToken: authToken, 
        initData: deanClassGroupTableState.initData, 
      }));
    },[
      deanClassGroupTableState.initData,
      dispatch,
      authToken,
    ])

  const setSelectedGradeInfo = useCallback((value: GradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedGradeInfoActionCreator({value, onSuccess}));
  },[setSelectedGradeInfoActionCreator,dispatch])

  return (
      <ClassTableView 
        loading={deanClassGroupTableState.loading}
        loadingRefresh={deanClassGroupTableState.loadingReloadTable}
        studentsStatistics={deanClassGroupTableState.studentsStatistics}
        classesIds={deanClassGroupTableState.classesIds}
        selectedGrade={deanClassGroupTableState.selectedGrade}
        initData={deanClassGroupTableState.initData}
        reloadTable={reloadDeanClassTable}
        setSelectedGrade={setSelectedGradeInfo}
        onBack={onBack}
        />
    );
});
