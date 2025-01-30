import styled from "styled-components";
import { theme } from "../themes/theme";

export const TextareaWrapper = styled.div<{ width?: number }>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: ${props => props.width? `${props.width}px` : '100%'};
  max-width: 440px;
`;

export const TextareaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
`;

export const TextareaStyled = styled.textarea<{
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  height?: number;
}>`
  width: 100%;
  autocomplete: off;
  box-shadow: 0 0 4px 2px #8f8fbf30;
  box-sizing: border-box;
  resize: none;
  border: 2px solid ${({ borderColor }) => borderColor};
  padding: 10px 10px 10px 10px;
  display: flex;
  border-radius: 10px;
  background-color: ${({ themeColor }) => themeColor};
  color: ${({ textColor }) => textColor};
  height: ${({ height }) => (height ? `${height}px` : '100px')};

  font-family: ${theme.fonts.ht1.family};
  font-weight: ${theme.fonts.ht1.weight};
  color: ${theme.fonts.ht1};

  font-size: ${theme.fonts.ht1.desktopSize};
  @media (max-width: ${theme.toMobileSize + "px"}){
    font-size: ${theme.fonts.ht1.mobileSize};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

export const CopyButton = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  right: 15px;
  bottom: 15px;
  border: 0px;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }
`;
