import { FC, memo, ReactNode } from "react";

import profileActive from '../../images/menu-panel/white/profile.svg';
import statisticsActive from '../../images/menu-panel/white/statistics.svg';
import subjectActive from '../../images/menu-panel/white/subject.svg';
import workshopActive from '../../images/menu-panel/white/workshop.svg';

import profileDisable from '../../images/menu-panel/gray/profile.svg';
import statisticsDisable from '../../images/menu-panel/gray/statistics.svg';
import subjectDisable from '../../images/menu-panel/gray/subject.svg';
import workshopDisable from '../../images/menu-panel/gray/workshop.svg';
import { UserRole } from "../../store/reducers/user-slice";

export type WrapperDesktopProps = {
	header?: string;
	role: UserRole;
	onBack?: () => void;
	children?: ReactNode;
};

export const WrapperDesktop: FC<WrapperDesktopProps> = memo(({
	header,
	role,
	children,
	onBack
}) => {
    


  return(
    <>
		{children}
    </>
)})

const studentSections = [
	{
		link: '',
		imageActive: statisticsActive,
		imageDisable: statisticsDisable,
	},
	{
		link: '',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const parentSections = [
	{
		link: '',
		imageActive: statisticsActive,
		imageDisable: statisticsDisable,
	},
	{
		link: '',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const deanSections = [
	{
		link: '',
		imageActive: workshopActive,
		imageDisable: workshopDisable,
	},
	{
		link: '',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const adminSections = [
	{
		link: '',
		imageActive: workshopActive,
		imageDisable: workshopDisable,
	},
	{
		link: '',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const teacherSections = [
	{
		link: '',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]