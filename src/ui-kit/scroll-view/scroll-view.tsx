import { FC, HtmlHTMLAttributes, ReactNode, memo, useCallback } from "react";
import { ScrollViewContainer } from "./scroll-view.styled";

export type ScrollViewProps = {
    children?: ReactNode;
    onScrollEnd?: () => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const ScrollView: FC<ScrollViewProps> = memo(({onScrollEnd, children, ...rest }) => {
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
            onScrollEnd?.();
        }
    }, [onScrollEnd]);

    return (
        <ScrollViewContainer onScroll={handleScroll} {...rest}>
            {children}
        </ScrollViewContainer>
    );
});