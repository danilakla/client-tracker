import { FC, memo } from 'react';
import { StudentsProps } from './students.props';
import { StudentsView } from './students.view';
import { useDeanWorkshop } from '../workshop/workshop.props';

export const Students: FC<StudentsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  
  return (
      <StudentsView 
        goToWorkshop={goToWorkshop}
        />
    );
});
