import { useNavigate } from 'react-router';
import { urls } from '../../../../Root';

export type StudentQrCodeScanerProps = {

};

export const useLogInUser = () => {

    const navigate = useNavigate();
    const studentQrCodeScaner = () => {
        navigate(urls.studentQrCodeScanner);
    };

    return studentQrCodeScaner;
};
