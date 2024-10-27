import styled, { keyframes } from "styled-components";
import { theme } from "../themes/theme";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const StyledCircleLoading = styled.div<{
    color?: string;
    size?: number;
}>`
  width: ${({ size }) => size !== undefined ?  size + "px" : "30px"};
  height: ${({ size }) =>  size !== undefined ? size + "px" : "30px"};

  display: flex;
  box-sizing: border-box;
  border-top: 4px solid ${({ color }) => color || theme.colors.primary}; 
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  display: inline-block;

  position: absolute;

  cursor: pointer;
`;

export const ContainerCircleLoading = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;