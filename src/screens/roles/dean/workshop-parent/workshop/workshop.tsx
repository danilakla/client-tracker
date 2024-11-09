import { FC, memo } from 'react';
import { WorkshopProps } from './workshop.props';
import { WorkshopView } from './workshop.view';
import { useSpecialties } from '../specialties/specialties.props';
import { useClassFormats } from '../class-formats/class-formats.props';
import { useControlSubjects } from '../control-subjects/control-subjects.props';
import { useGenerateStudents } from '../generate-students/generate-students.props';
import { useDeanStudents } from '../students/students.props';

export const Workshop: FC<WorkshopProps> = memo(() => {
  
  const goToSpecialties = useSpecialties();
  const goToClassFormats = useClassFormats();
  const goToControlSubjects = useControlSubjects();
  const goToGenerateStudents = useGenerateStudents();
  const goToDeanStudents = useDeanStudents();

  return (
      <WorkshopView 
        goToSpecialties={goToSpecialties}
        goToDeanStudents={goToDeanStudents}
        goToClassFormats={goToClassFormats}
        goToControlSubjects={goToControlSubjects}
        goToGenerateStudents={goToGenerateStudents}
        />
    );
});
