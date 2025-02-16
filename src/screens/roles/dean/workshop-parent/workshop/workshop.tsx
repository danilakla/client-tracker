import { FC, memo } from 'react';
import { WorkshopProps } from './workshop.props';
import { WorkshopView } from './workshop.view';
import { useSpecialties } from '../specialties/specialties.props';
import { useClassFormats } from '../class-formats/class-formats.props';
import { useGenerateStudents } from '../generate-students/generate-students.props';
import { useDeanStudents } from '../students/students.props';
import { useControlSubjects } from '../subjects-parent/control-subjects/control-subjects.props';
import { useAttestation } from '../attestation-parent/attestation/attestation.props';

export const Workshop: FC<WorkshopProps> = memo(() => {
  
  const goToSpecialties = useSpecialties();
  const goToClassFormats = useClassFormats();
  const goToControlSubjects = useControlSubjects();
  const goToGenerateStudents = useGenerateStudents();
  const goToDeanStudents = useDeanStudents();
  const goToAttestation = useAttestation();

  return (
      <WorkshopView 
        goToSpecialties={goToSpecialties}
        goToDeanStudents={goToDeanStudents}
        goToClassFormats={goToClassFormats}
        goToControlSubjects={goToControlSubjects}
        goToGenerateStudents={goToGenerateStudents}
        goToAttestation={goToAttestation}
        />
    );
});
