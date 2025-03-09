import { FC, memo } from 'react';
import { ClassTableProps } from './class-table.props';
import { ClassTableView } from './class-table.view';

export const ClassTable: FC<ClassTableProps> = memo(() => {
  

  return (
      <ClassTableView 
        />
    );
});
