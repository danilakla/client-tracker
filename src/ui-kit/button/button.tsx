import { FC, HtmlHTMLAttributes, memo, ReactNode } from "react";
import { StyledButton } from "./button.styles";
import { Text } from "../text";
import { theme } from "../themes/theme";
import { CircleLoading } from "../circle-loading";

export type ButtonProps = {
    variant: 'primary' | 'attentive' | 'recomended'
    width?: number | string;
    children?: ReactNode;
    height?: number | string;
    sizeLoading?: number;
    onClick?: () => void;
    state?: "idle" | "loading" | "success" | "error";
    padding?: number | [number?, number?, number?, number?];
} & HtmlHTMLAttributes<HTMLElement>;

export const Button: FC<ButtonProps> = memo(({
    width,
    variant,
    height,
    sizeLoading = 15,
    state = 'idle',
    onClick,
    children, 
    ...rest 
}) => {

    return <StyledButton
        variant={variant}
        borderRaius={12}
        height={height}
        disabled={state === 'loading'}
        width={width}
        onClick={onClick}
        { ...rest}
    >
        <CircleLoading size={sizeLoading} state={state} color={theme.colors.surface}/>
        <Text themeColor={theme.colors.surface} style={{
            visibility: state === 'loading' ? 'hidden' : 'visible',
            wordBreak: 'normal'
            }} themeFont={theme.fonts.h3}>
            {children}
        </Text>
    </StyledButton>
})

