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
};

export const ActionButton : FC<ActionButtonProps> = memo(({
  text,
  width,
  textColor = theme.colors.nothing,
  themeFont = theme.fonts.ht1,
  isShowArrow = true,
  onClick
}) => {
  return(
    <ButtonWrapper width={width}>
      <ButtonContainer width={width} onClick={onClick}>
        <ActionButtonStyled>
          <Text 
            style={{
              width: 'calc(100% - 25px)',
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis'
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