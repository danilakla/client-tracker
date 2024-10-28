import { FC, memo } from "react";
import { ActionBlockButtonStyled } from "./action-block-button.styles";
import { Text } from "../text";
import { theme } from "../themes/theme";

export type ActionBlockButtonProps = {
  text?: string;
  size?: number;
  textColor?: string;
  themeColor?: string;
  borderRadius?: number;
  onClick?: () => void;
};

export const ActionBlockButton : FC<ActionBlockButtonProps> = memo(({
  text,
  textColor,
  borderRadius,
  size,
  themeColor,
  onClick
}) => {
  return(
        <ActionBlockButtonStyled 
          onClick={onClick} 
          themeColor={themeColor}
          borderRadius={borderRadius}
          size={size}
          textColor={textColor}>
          <Text 
            style={{
              wordBreak: 'break-all',
              textAlign: 'center',
              overflow: 'hidden', 
              textOverflow: 'ellipsis'
            }} 
            themeFont={theme.fonts.ht1}>
            {text}
          </Text>
        </ActionBlockButtonStyled>
)});