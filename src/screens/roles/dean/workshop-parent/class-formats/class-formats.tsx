import { FC, memo } from 'react';
import { ClassFormatsProps } from './class-formats.props';
import { ClassFormatsView } from './class-formats.view';
import { useDeanWorkshop } from '../workshop/workshop.props';

export const ClassFormats: FC<ClassFormatsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  return (
      <ClassFormatsView 
        goToWorkshop={goToWorkshop}
        />
    );
});
