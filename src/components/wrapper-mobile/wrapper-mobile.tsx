import { FC, memo, ReactNode } from "react";

import profileActive from '../../images/menu-panel/primary/profile.svg';
import scannerActive from '../../images/menu-panel/primary/scanner.svg';
import statisticsActive from '../../images/menu-panel/primary/statistics.svg';
import subjectActive from '../../images/menu-panel/primary/subject.svg';
import workshopActive from '../../images/menu-panel/primary/workshop.svg';

import profileDisable from '../../images/menu-panel/gray/profile.svg';
import scannerDisable from '../../images/menu-panel/gray/scanner.svg';
import statisticsDisable from '../../images/menu-panel/gray/statistics.svg';
import subjectDisable from '../../images/menu-panel/gray/subject.svg';
import workshopDisable from '../../images/menu-panel/gray/workshop.svg';

import backArrowSVG from '../../images/back-arrow.svg';

import { UserRole } from "../../store/reducers/user-slice";
import { BackButton, BottomContainer, HeaderContainer, ImageArrowButton, ImageButton, ScreenContent, Wrapper } from "./wrapper-mobile.styles";
import { Text } from "../../ui-kit/text";
import { theme } from "../../ui-kit/themes/theme";
import { Spacing } from "../../ui-kit/spacing";

export type WrapperMobileProps = {
	header?: string;
	role: UserRole;
	onBack?: () => void;
	children?: ReactNode;
};

export const WrapperMobile: FC<WrapperMobileProps> = memo(({
	header,
	role,
	children,
	onBack
}) => {
    


  return(
    <Wrapper>
		<HeaderContainer>
			<BackButton>
				<ImageArrowButton src={backArrowSVG}/>
				<Spacing themeSpace={3} variant='Row' />
				<Text themeFont={theme.fonts.ml}>
					Назад
				</Text>
			</BackButton>
			<Text themeFont={theme.fonts.h2}>
				{header}
			</Text>
		</HeaderContainer>

		<ScreenContent>
			{children}
		</ScreenContent>

		<BottomContainer>
			{role === 'ROLE_ADMIN' && adminSections.map(
				(item) => <ImageButton src={item.imageDisable}/>)}
			{role === 'ROLE_DEAN' && deanSections.map(
				(item) => <ImageButton src={item.imageDisable}/>)}
			{role === 'ROLE_PARENT' && parentSections.map(
				(item) => <ImageButton src={item.imageDisable}/>)}
			{role === 'ROLE_STUDENT' && studentSections.map(
				(item) => <ImageButton src={item.imageDisable}/>)}
			{role === 'ROLE_TEACHER' && teacherSections.map(
				(item) => <ImageButton src={item.imageDisable}/>)}
		</BottomContainer>
    </Wrapper>
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
		imageActive: scannerActive,
		imageDisable: scannerDisable,
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