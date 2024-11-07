import { FC, memo } from 'react';
import { ControlSubjectsProps } from './control-subjects.props';
import { ControlSubjectsView } from './control-subjects.view';
import { useDeanWorkshop } from '../workshop/workshop.props';

export const ControlSubjects: FC<ControlSubjectsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  return (
      <ControlSubjectsView 
        goToWorkshop={goToWorkshop}
        />
    );
});
