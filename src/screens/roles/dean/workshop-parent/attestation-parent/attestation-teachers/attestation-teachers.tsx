import { FC, memo } from 'react';
import { AttestationTeachersProps } from './attestation-teachers.props';
import { AttestationTeachersView } from './attestation-teachers.view';
import { useAttestation } from '../attestation/attestation.props';

export const AttestationTeachers: FC<AttestationTeachersProps> = memo(() => {
  
  const goToAttestation = useAttestation();

  return (
      <AttestationTeachersView 
        goToAttestation={goToAttestation}
        />
    );
});
