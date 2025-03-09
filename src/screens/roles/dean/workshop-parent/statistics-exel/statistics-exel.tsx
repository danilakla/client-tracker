import { FC, memo, useCallback } from 'react';
import { StatisticsExcelProps } from './statistics-exel.props';
import { StatisticsExcelView } from './statistics-exel.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { getStatisticsExcelActionCreator } from '../../../../../store/reducers/roles/dean/statistics-excel-slice';

export const StatisticsExcel: FC<StatisticsExcelProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  const deanStatisticsExcelState = useTypedSelector(state => state.deanStatisticsExcel);

  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const getStatisticsExcel = useCallback((onSuccess: () => void, onError: () => void)=>{
    dispatch(getStatisticsExcelActionCreator({
      authToken,
      onSuccess,
      onError
    }));
  },[dispatch, authToken])

  return (
      <StatisticsExcelView 
        getStatisticsExcel={getStatisticsExcel}
        goToWorkshop={goToWorkshop}
        loading={deanStatisticsExcelState.loading}
        />
    );
});
