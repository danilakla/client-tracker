import { FC, memo } from 'react';
import { SpecialtiesProps } from './specialties.props';
import { SpecialtiesView } from './specialties.view';
import { useDeanWorkshop } from '../workshop/workshop.props';

export const Specialties: FC<SpecialtiesProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  return (
      <SpecialtiesView 
        goToWorkshop={goToWorkshop}
        />
    );
});
