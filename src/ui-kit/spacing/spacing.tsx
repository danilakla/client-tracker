import { FC, HtmlHTMLAttributes, memo } from "react";
import { SpacingStyled } from "./spacing.styles";

export type SpacingProps = {
   themeSpace: number;
   variant: "Row" | "Column";
} & HtmlHTMLAttributes<HTMLElement>;

export const Spacing: FC<SpacingProps> = memo(({ themeSpace, variant, ...rest }) => 
   <SpacingStyled {...rest} variant={variant} space={themeSpace}/>
);