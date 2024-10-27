import styled from "styled-components";
import { theme } from "../themes/theme";

export const ButtonWrapper = styled.div<{ width?: string }>`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 0px;
  width: ${props => props.width? `${props.width}` : '100%'};
  max-width: 440px;
`;

export const ButtonContainer = styled.div<{width?: string}>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
  cursor: pointer;
`;

export const ActionButtonStyled = styled.div<{
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
}>`
  width: 100%;
  height: 42px;
  box-shadow: 0 0 10px 5px rgba(221, 221, 221, 1);
  box-sizing: border-box;
  border: none;
  padding: 0px 20px;
  display: flex;
  border-radius: 10px;
  background-color: ${({ themeColor }) => themeColor};
  color: ${({ textColor }) => textColor};
  align-items: center;

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

export const ArrowButton = styled.img`
  position: absolute;
  width: 17px;
  height: 17px;
  right: 20px;
  border: 0px;
  cursor: pointer;
`;