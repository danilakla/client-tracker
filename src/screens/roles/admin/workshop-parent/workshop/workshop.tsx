import { FC, memo } from 'react';
import { WorkshopProps } from './workshop.props';
import { WorkshopView } from './workshop.view';
import { useGeneratorKeys } from '../generator-keys/generator-keys.props';
import { useUniversityEditor } from '../university-editor/university-editor.props';
import { useMembers } from '../members/members.props';

export const Workshop: FC<WorkshopProps> = memo(() => {

  const goToGeneratorKeys = useGeneratorKeys();
  const goToUniversityEditor = useUniversityEditor();
  const goToMembers = useMembers();

  return (
      <WorkshopView 
        goToMembers={goToMembers}
        goToUniversityEditor={goToUniversityEditor}
        goToGeneratorKeys={goToGeneratorKeys}
        />
    );
});
