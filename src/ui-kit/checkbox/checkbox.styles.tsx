import styled from "styled-components";
import { theme } from "../themes/theme";


export const CheckboxContainer = styled.label<{
  size: number
  themeColor?: string;
  borderColor?: string;
  borderRadius?: number;
  }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  box-shadow: 0 0 4px 2px #8f8fbf25;
  border: 2px solid ${({ borderColor }) => borderColor};
  padding: 10px 10px 10px 10px;
  display: flex;
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  background-color: ${({ themeColor }) => themeColor};
  overflow: hidden;
`;

export const CheckboxMark = styled.img`
  width: 100%;
  height: 100%;
`;