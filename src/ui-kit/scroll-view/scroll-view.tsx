import { FC, HtmlHTMLAttributes, ReactNode, memo } from "react";
import { ScrollViewContainer } from "./scroll-view.styled";

export type ScrollViewProps = {
    children?: ReactNode;
} & HtmlHTMLAttributes<HTMLElement>;

export const ScrollView: FC<ScrollViewProps> = memo(({ children, ...rest }) => {
    return (
        <ScrollViewContainer {...rest}>
            {children}
        </ScrollViewContainer>
    );
});