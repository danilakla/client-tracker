import { FC, memo } from 'react';
import { StatisticsExcelProps } from './statistics-exel.props';
import { StatisticsExcelView } from './statistics-exel.view';
import { useDeanWorkshop } from '../workshop/workshop.props';

export const StatisticsExcel: FC<StatisticsExcelProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  return (
      <StatisticsExcelView 
        goToWorkshop={goToWorkshop}
        />
    );
});
