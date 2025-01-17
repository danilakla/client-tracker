import styled from "styled-components";
import { theme } from "../themes/theme";
  
export const SliderInput = styled.input`
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 4px;
  background: #ddd;
  outline: none;
  opacity: 0.9;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
`;

export const SliderContainer = styled.div<{width?: number | undefined}>`
  width: ${({ width }) => (width ? width + "px" : "260px")};
`;