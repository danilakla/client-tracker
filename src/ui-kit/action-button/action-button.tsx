import { FC, memo } from "react";
import { ActionButtonStyled, ArrowButton, ButtonContainer, ButtonWrapper } from "./action-button.styles";
import { Text } from "../text";
import { theme } from "../themes/theme";

import arrowActiveButtonSVG from "../assets/arrow-button.svg";
import { Spacing } from "../spacing";

export type ActionButtonProps = {
  text?: string;
  width?: string;
  onClick?: () => void;
  isShowArrow?: boolean;
};

export const ActionButton : FC<ActionButtonProps> = memo(({
  text,
  width,
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
            themeFont={theme.fonts.ht1}>
            {text}
          </Text>
        </ActionButtonStyled>
        {isShowArrow && <ArrowButton src={arrowActiveButtonSVG}/>}
      </ButtonContainer>
    </ButtonWrapper>
)});