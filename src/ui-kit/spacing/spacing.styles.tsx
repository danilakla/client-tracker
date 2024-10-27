import { styled } from "styled-components"

export const SpacingStyled = styled.div<{
    space: number;
    variant: "Row" | "Column";
  }>`
    margin-top: ${(props) =>
      props.variant === "Column" && `${props.space}px`};
    margin-left: ${(props) =>
      props.variant === "Row" && `${props.space}px`};
  `;