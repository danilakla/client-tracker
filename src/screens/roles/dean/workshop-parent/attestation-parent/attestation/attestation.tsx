import { FC, memo } from 'react';
import { AttestationProps } from './attestation.props';
import { AttestationView } from './attestation.view';
import { useAttestationStart } from '../attestation-start/attestation-start.props';
import { useAttestationStudents } from '../attestation-students/attestation-students.props';
import { useAttestationTeachers } from '../attestation-teachers/attestation-teachers.props';
import { useDeanWorkshop } from '../../workshop/workshop.props';

export const Attestation: FC<AttestationProps> = memo(() => {
  
  const goToAttestationStart = useAttestationStart();
  const goToAttestationStudents = useAttestationStudents();
  const goToAttestationTeachers = useAttestationTeachers();
  const goToDeanWorkshop = useDeanWorkshop();

  return (
      <AttestationView 
        goToAttestationStart={goToAttestationStart}
        goToAttestationStudents={goToAttestationStudents}
        goToAttestationTeachers={goToAttestationTeachers}
        goToDeanWorkshop={goToDeanWorkshop}
        />
    );
});
