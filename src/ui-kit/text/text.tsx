import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { StyledText } from "./text.styles";
import { FontProps, theme } from "../themes/theme";

export type TextProps = {
    themeFont: FontProps;
    themeColor?: string;
    themePadding?: number | [number?, number?, number?, number?];
    transform?: 'lowercase' | 'uppercase';
    align?: 'center' | 'right' | 'left';
    children? : ReactNode;
} & HtmlHTMLAttributes<HTMLElement>;

export const Text : FC<TextProps> = memo(({ 
    themeFont, 
    themeColor = theme.colors.nothing, 
    themePadding, 
    transform, 
    align, 
    children, 
    ...rest 
}) => 
    <StyledText font={themeFont} color={themeColor} padding={themePadding} transform={transform} align={align} {...rest}>
        {children}
    </StyledText>
);