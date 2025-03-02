import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type StatisticsExcelProps = {

};

export const useStatisticsExcel = () => {

    const navigate = useNavigate();
    const statisticsExcel = () => {
        navigate(urls.deanStatisticsEcxel);
    };

    return statisticsExcel;
};
