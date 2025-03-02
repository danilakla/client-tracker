import { FC, HtmlHTMLAttributes, memo, ReactNode, useState } from "react";

import profileActive from '../../images/menu-panel/white/profile.svg';
import subjectActive from '../../images/menu-panel/white/subject.svg';
import workshopActive from '../../images/menu-panel/white/workshop.svg';

import profileDisable from '../../images/menu-panel/gray/profile.svg';
import subjectDisable from '../../images/menu-panel/gray/subject.svg';
import workshopDisable from '../../images/menu-panel/gray/workshop.svg';
import { UserRole } from "../../store/reducers/user-slice";
import { BackButton, ControlPanelContainer, ControlPanelWrapper, HeaderContainer, ImageArrowButton, ImageButtonStyled, ScreenContent, SelectedButtonWrapper, Wrapper } from "./wrapper-desktop.styles";
import { Spacing } from "../../ui-kit/spacing";
import { Text } from "../../ui-kit/text";
import { theme } from "../../ui-kit/themes/theme";
import backArrowSVG from '../../images/back-arrow.svg';
import { useLocation, useNavigate } from "react-router-dom";

export type WrapperDesktopProps = {
	header?: string;
	role: UserRole;
	onBack?: () => void;
	children?: ReactNode;
	isCenter?: boolean;
} & HtmlHTMLAttributes<HTMLElement>;

export const WrapperDesktop: FC<WrapperDesktopProps> = memo(({
	header,
	role,
	isCenter = false,
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
	  			<Text themeFont={theme.fonts.ht2}>
	  				Назад
	  			</Text>
	  		</BackButton>}
	  		<Text themeFont={theme.fonts.h2}>
	  			{header}
	  		</Text>
	  	</HeaderContainer>
    
	  	<ScreenContent height={window.innerHeight} isCenter={isCenter} {...rest}>
	  		{children}
	  	</ScreenContent>
    
		<ControlPanelWrapper height={window.innerHeight}>
			<ControlPanelContainer>
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
	  		</ControlPanelContainer>
		</ControlPanelWrapper>
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

  return(
    <SelectedButtonWrapper onClick={() => navigate(item.link)} isAvctive={isActive}>
      <ImageButtonStyled src={isActive ? item.imageActive : item.imageDisable}/>
    </SelectedButtonWrapper>
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