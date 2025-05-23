import { FC, memo } from "react";
import { ActionButtonStyled, ArrowButton, ButtonContainer, ButtonWrapper } from "./action-button.styles";
import { Text } from "../text";
import { FontProps, theme } from "../themes/theme";

import arrowActiveButtonSVG from "../assets/arrow-button.svg";

export type ActionButtonProps = {
  text?: string;
  width?: string;
  onClick?: () => void;
  textColor?: string;
  themeFont?: FontProps;
  isShowArrow?: boolean;
  themeColor?: string;
};

export const ActionButton : FC<ActionButtonProps> = memo(({
  text,
  themeColor = theme.colors.surface,
  width,
  textColor = theme.colors.gray,
  themeFont = theme.fonts.ht1,
  isShowArrow = true,
  onClick
}) => {
  return(
    <ButtonWrapper width={width}>
      <ButtonContainer width={width} onClick={onClick}>
        <ActionButtonStyled themeColor={themeColor}>
          <Text 
            format='hide'
            style={{
              width: isShowArrow ? 'calc(100% - 25px)' : '100%',
            }} 
            themeColor={textColor}
            themeFont={themeFont}>
            {text}
          </Text>
        </ActionButtonStyled>
        {isShowArrow && <ArrowButton src={arrowActiveButtonSVG}/>}
      </ButtonContainer>
    </ButtonWrapper>
)});