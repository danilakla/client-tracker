import styled from "styled-components";
import { SurfaceProps } from "./surface";
import { theme } from "../themes/theme";

export const StyledSurface = styled.div<SurfaceProps>`
  border-radius: ${({ borderRadius }) => borderRadius || '20px'};
  border: ${({ borderColor }) => borderColor ? `2px solid ${borderColor}` : 0};
  padding: ${({ padding }) => padding || '25px'};
  background-color:${({ themeColor }) =>  themeColor ? themeColor : theme.colors.surface};
  box-shadow: ${({ shadow }) => shadow ? shadow : '0 0 4px 2px #8f8fbf30'};
  box-sizing: border-box;
  width: ${(({ width }) => width === undefined ? `100%` : typeof width === "number" ? `${width}px` : width)};
  height: ${(({ height }) => height === undefined ? `auto` : typeof height === "number" ? `${height}px` : height)}; 
`;