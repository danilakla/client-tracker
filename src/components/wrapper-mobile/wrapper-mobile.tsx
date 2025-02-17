import { FC, HtmlHTMLAttributes, memo, ReactNode, useState } from "react";

import profileActive from '../../images/menu-panel/primary/profile.svg';
import subjectActive from '../../images/menu-panel/primary/subject.svg';
import workshopActive from '../../images/menu-panel/primary/workshop.svg';

import profileDisable from '../../images/menu-panel/gray/profile.svg';
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
} & HtmlHTMLAttributes<HTMLElement>;

export const WrapperMobile: FC<WrapperMobileProps> = memo(({
	header,
	role,
	children,
	onBack,
	...rest
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
			<Text 
				themeFont={theme.fonts.h2} 
				format='hide'
            	style={{
            	  maxWidth: 'calc(100% - 140px)',
            	}} >
				{header}
			</Text>
		</HeaderContainer>

		<ScreenContent {...rest}>
			{children}
		</ScreenContent>

		<BottomContainer>
			{role === 'ROLE_ADMIN' && adminSections.map(
	  			(item, index) => <ImageButton key={index}
					item={item}/>)}
	  		{role === 'ROLE_DEAN' && deanSections.map(
	  			(item, index) => <ImageButton key={index}
        			item={item}/>)}
	  		{role === 'ROLE_PARENTS' && parentSections.map(
	  			(item, index) => <ImageButton key={index}
        			item={item}/>)}
	  		{role === 'ROLE_STUDENT' && studentSections.map(
	  			(item, index) => <ImageButton key={index}
        			item={item}/>)}
	  		{role === 'ROLE_TEACHER' && teacherSections.map(
	  			(item, index) => <ImageButton key={index}
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

const parentSections = [
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