import { FC, memo } from 'react';
import { StudentQrCodeScanerProps } from './student-qr-code-scaner.props';
import { StudentQrCodeScanerView } from './student-qr-code-scaner.view';

export const StudentQrCodeScaner: FC<StudentQrCodeScanerProps> = memo(() => {
  

  return (
      <StudentQrCodeScanerView 
        />
    );
});
