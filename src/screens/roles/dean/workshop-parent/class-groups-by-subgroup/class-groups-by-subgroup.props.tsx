import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';
import { useAppDispatch } from '../../../../../hooks/use-typed-selector';
import { classGroupsBySubgroupSlice } from '../../../../../store/reducers/roles/dean/class-groups-by-subgroup-slice';

export type ClassGroupsBySubgroupProps = {

};

export const useDeanClassGroupsBySubgroup = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const classGroupsBySubgroup = () => {
        dispatch(classGroupsBySubgroupSlice.actions.resetWithSuccess(() => navigate(urls.deanClassGroupsBySubgroup)));
    };

    return classGroupsBySubgroup;
};
