import { FC, memo } from 'react';
import { AttestationStudentsProps } from './attestation-students.props';
import { AttestationStudentsView } from './attestation-students.view';
import { useAttestation } from '../attestation/attestation.props';

export const AttestationStudents: FC<AttestationStudentsProps> = memo(() => {

  const goToAttestation = useAttestation();

  return (
      <AttestationStudentsView 
        goToAttestation={goToAttestation}
        />
    );
});
