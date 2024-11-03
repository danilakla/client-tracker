import { FC, memo } from "react";
import { ActionBlockButtonStyled } from "./action-block-button.styles";
import { Text } from "../text";
import { FontProps, theme } from "../themes/theme";

export type ActionBlockButtonProps = {
  text?: string;
  size?: number;
  textColor?: string;
  themeColor?: string;
  borderRadius?: number;
  themeFont?: FontProps;
  onClick?: () => void;
};

export const ActionBlockButton : FC<ActionBlockButtonProps> = memo(({
  text,
  textColor,
  borderRadius,
  themeFont = theme.fonts.ht1,
  size,
  themeColor = theme.colors.surface,
  onClick
}) => {
  return(
        <ActionBlockButtonStyled 
          onClick={onClick} 
          themeColor={themeColor}
          borderRadius={borderRadius}
          size={size}>
          <Text 
            style={{
              wordBreak: 'break-word',
              textAlign: 'center',
              overflow: 'hidden', 
              textOverflow: 'ellipsis'
            }} 
            themeColor={textColor}
            themeFont={themeFont}>
            {text}
          </Text>
        </ActionBlockButtonStyled>
)});