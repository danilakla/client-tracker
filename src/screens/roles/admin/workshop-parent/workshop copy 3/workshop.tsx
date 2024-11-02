import { FC, memo } from 'react';
import { WorkshopProps } from './workshop.props';
import { WorkshopView } from './workshop.view';

export const Workshop: FC<WorkshopProps> = memo(() => {
  

  return (
      <WorkshopView 
        />
    );
});
