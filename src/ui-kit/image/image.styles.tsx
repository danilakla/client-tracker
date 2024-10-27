import styled from "styled-components";
import { theme } from "../themes/theme";

export const StyledImage = styled.img<{
  width?: number;
  height?: number;
  widthDesktop?: number;
  heightDesktop?: number;
}>`
  width: ${(props) => (props.widthDesktop ? `${props.widthDesktop}px` : props.width ? `${props.width}px` : "auto")};
  height: ${(props) => (props.heightDesktop ? `${props.heightDesktop}px` : props.height ? `${props.height}px` : "auto")};

  @media (max-width: ${theme.toMobileSize + "px"}) {
    width: ${(props) => (props.width ? `${props.width}px` : "auto")};
    height: ${(props) => (props.height ? `${props.height}px` : "auto")};
  }
`;
