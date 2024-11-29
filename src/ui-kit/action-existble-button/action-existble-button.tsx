import { FC, memo } from "react";
import { ActionButtonStyled, ImageButton, ButtonContainer, ButtonWrapper } from "./action-existble-button.styles";
import { Text } from "../text";
import { FontProps, theme } from "../themes/theme";

import addSVG from '../assets/plus.svg';
import removeSVG from '../assets/bin.svg';

export type ActionExistbleButtonProps = {
  text?: string;
  width?: string;
  onClick?: () => void;
  textColor?: string;
  themeFont?: FontProps;
  themeColor?: string;
  exist?: boolean;
};

export const ActionExistbleButton : FC<ActionExistbleButtonProps> = memo(({
  text,
  themeColor = theme.colors.surface,
  width,
  textColor = theme.colors.gray,
  themeFont = theme.fonts.ht1,
  exist = false,
  onClick
}) => {
  return(
    <ButtonWrapper width={width}>
      <ButtonContainer width={width}>
        <ActionButtonStyled themeColor={themeColor}>
          <Text 
            format='hide'
            style={{
              width: 'calc(100% - 25px)',
            }} 
            themeColor={textColor}
            themeFont={themeFont}>
            {text}
          </Text>
        </ActionButtonStyled>
        <ImageButton onClick={onClick} src={exist ? removeSVG : addSVG}/>
      </ButtonContainer>
    </ButtonWrapper>
)});