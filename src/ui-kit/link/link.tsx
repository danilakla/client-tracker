import { FC, memo, ReactNode } from "react";
import { LinkWrapper } from "./link.styles";
import { Text } from "../text";
import { theme } from "../themes/theme";
import { Spacing } from "../spacing";
import { Line } from "../line";

export type LinkProps = {
    children?: ReactNode;
    onClick?: () => void;
    colorUnderline?: string;
};

export const Link : FC<LinkProps> = memo(({ 
    children,
    colorUnderline = theme.colors.gray,
    onClick
}) => 
    <LinkWrapper onClick={onClick}>
        {children}
        <Spacing variant='Column' themeSpace={2}/>
        <Line color={colorUnderline} height={1}/>
    </LinkWrapper>
);