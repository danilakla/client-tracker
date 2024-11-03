import { FC, ReactNode, memo } from "react";
import { Line, ToggleButton, ToggleContainer } from "./toggle.styles";
import { Text } from "../text";
import { Row } from "../row/row";
import { Spacing } from "../spacing";
import { theme } from "../themes/theme";

export type ToggleProps = {
    varinat: "left" | "right";
    onButtonClick: () => void;
    leftText: ReactNode;
    rightText: ReactNode;
    spaceBetween?: number;
};

export const Toggle: FC<ToggleProps> = memo(({ varinat, onButtonClick, spaceBetween, leftText, rightText }) => {
    return(
        <ToggleContainer>
            <Row>
                <ToggleButton
                    active={varinat === "left" && true}
                    onClick={onButtonClick}
                >
                    <Text
                        themeColor={varinat === "left" ? theme.colors.primary : theme.colors.gray}
                        themeFont={theme.fonts.h2}>{leftText}
                    </Text>
                    <Spacing themeSpace={5} variant="Column" />
                    <Line active={varinat === "left" && true} />
                </ToggleButton>
                <Spacing variant="Row" themeSpace={spaceBetween? spaceBetween : 40} />
                <ToggleButton
                    active={varinat === "right" && true}
                    onClick={onButtonClick}
                >
                    <Text
                        themeColor={varinat === "right" ? theme.colors.primary : theme.colors.gray}
                        themeFont={theme.fonts.h2}>{rightText}
                    </Text>
                    <Spacing themeSpace={5} variant="Column" />
                    <Line active={varinat === "right" && true} />
                </ToggleButton>
            </Row>
        </ToggleContainer>
    )
});