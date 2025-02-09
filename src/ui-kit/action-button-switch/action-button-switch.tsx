import { FC, memo } from "react";
import { ActionButtonStyled, SwitchWrapper, ButtonContainer, ButtonWrapper, SwitcherCircle } from "./action-button-switch.styles";
import { Text } from "../text";
import { FontProps, theme } from "../themes/theme";

export type ActionButtonSwitchProps = {
  text?: string;
  width?: string;
  onClick?: () => void;
  disable?: boolean;
  textColor?: string;
  themeFont?: FontProps;
  borderColor?: string;
  themeColor?: string;
  isLeft: boolean;
};

export const ActionButtonSwitch : FC<ActionButtonSwitchProps> = memo(({
  text,
  themeColor = theme.colors.surface,
  width,
  disable = false,
  borderColor = theme.colors.foreground,
  textColor = theme.colors.gray,
  isLeft,
  themeFont = theme.fonts.ht1,
  onClick
}) => {
  return(
    <ButtonWrapper width={width}>
      <ButtonContainer width={width} onClick={disable ? () => {} : onClick}>
        <ActionButtonStyled borderColor={borderColor} themeColor={themeColor}>
          <Text 
            format='hide'
            style={{
              width: 'calc(100% - 53px)',
            }} 
            themeColor={textColor}
            themeFont={themeFont}>
            {text}
          </Text>
        </ActionButtonStyled>
        <SwitchWrapper isLeft={isLeft}>
          <SwitcherCircle isLeft={isLeft}/>
        </SwitchWrapper>
      </ButtonContainer>
    </ButtonWrapper>
)});