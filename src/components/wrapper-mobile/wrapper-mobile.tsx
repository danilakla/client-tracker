import { FC, memo, ReactNode, useState } from "react";

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
import { BackButton, BottomContainer, HeaderContainer, ImageArrowButton, ImageButtonStyled, ScreenContent, Wrapper } from "./wrapper-mobile.styles";
import { Text } from "../../ui-kit/text";
import { theme } from "../../ui-kit/themes/theme";
import { Spacing } from "../../ui-kit/spacing";
import { useLocation, useNavigate } from "react-router-dom";

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
			{onBack && <BackButton onClick={onBack}>
				<ImageArrowButton src={backArrowSVG}/>
				<Spacing themeSpace={3} variant='Row' />
				<Text themeFont={theme.fonts.ml}>
					Назад
				</Text>
			</BackButton>}
			<Text themeFont={theme.fonts.h2}>
				{header}
			</Text>
		</HeaderContainer>

		<ScreenContent>
			{children}
		</ScreenContent>

		<BottomContainer>
			{role === 'ROLE_ADMIN' && adminSections.map(
	  			(item) => <ImageButton 
					item={item}/>)}
	  		{role === 'ROLE_DEAN' && deanSections.map(
	  			(item) => <ImageButton 
        			item={item}/>)}
	  		{role === 'ROLE_PARENT' && parentSections.map(
	  			(item) => <ImageButton 
        			item={item}/>)}
	  		{role === 'ROLE_STUDENT' && studentSections.map(
	  			(item) => <ImageButton 
        			item={item}/>)}
	  		{role === 'ROLE_TEACHER' && teacherSections.map(
	  			(item) => <ImageButton 
        			item={item}/>)}
		</BottomContainer>
    </Wrapper>
)})

export type ImageButtonProps = {
	item: {
	  link: string;
	  imageActive: string;
	  imageDisable: string;
	}
  };
  
export const ImageButton: FC<ImageButtonProps> = memo(({
	item
}) => {
	const navigate = useNavigate();
	const location = useLocation();

  	const [isActive] = useState<boolean>(location.pathname.includes(item.link));

	return(<ImageButtonStyled 
		onClick={() => navigate(item.link)} 
		src={isActive ? item.imageActive : item.imageDisable}/>
)})

const studentSections = [
	{
		link: '/student/statistics',
		imageActive: statisticsActive,
		imageDisable: statisticsDisable,
	},
	{
		link: '/student/subjects',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '/student/scanner',
		imageActive: scannerActive,
		imageDisable: scannerDisable,
	},
	{
		link: '/profile',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const parentSections = [
	{
		link: '/student/statistics',
		imageActive: statisticsActive,
		imageDisable: statisticsDisable,
	},
	{
		link: '/student/subjects',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '/profile',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const deanSections = [
	{
		link: '/dean/workshop',
		imageActive: workshopActive,
		imageDisable: workshopDisable,
	},
	// {
	// 	link: '/teacher/subjects',
	// 	imageActive: subjectActive,
	// 	imageDisable: subjectDisable,
	// },
	{
		link: '/profile',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const adminSections = [
	{
		link: '/admin/workshop',
		imageActive: workshopActive,
		imageDisable: workshopDisable,
	},
	{
		link: '/profile',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]

const teacherSections = [
	{
		link: '/teacher/subjects',
		imageActive: subjectActive,
		imageDisable: subjectDisable,
	},
	{
		link: '/profile',
		imageActive: profileActive,
		imageDisable: profileDisable,
	}
]