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
}>`
  width: 100%;
  height: 42px;
  border: 2px solid #e9e9f2;
  box-sizing: border-box;
  box-shadow: 0 0 4px 2px #8f8fbf15;
  padding: 0px 20px;
  display: flex;
  border-radius: 10px;
  background-color: ${({ themeColor }) => themeColor};
  align-items: center;

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

export const ImageButton = styled.img`
  position: absolute;
  right: 7px;
  border: 0px;
  cursor: pointer;
`;