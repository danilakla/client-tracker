import { FC, memo } from 'react';
import { AttestationStartProps } from './attestation-start.props';
import { AttestationStartView } from './attestation-start.view';
import { useAttestation } from '../attestation/attestation.props';

export const AttestationStart: FC<AttestationStartProps> = memo(() => {
  const goToAttestation = useAttestation();

  return (
      <AttestationStartView 
        goToAttestation={goToAttestation}
        />
    );
});
