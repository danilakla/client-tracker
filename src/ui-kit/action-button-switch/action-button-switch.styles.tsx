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
  borderColor?: string;
}>`
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 0px 20px 0px 10px;
  box-shadow: 0 0 4px 2px #8f8fbf15;
  display: flex;
  border-radius: 10px;
  border: 2px solid ${({ borderColor }) => borderColor};
  background-color: ${({ themeColor }) => themeColor};
  align-items: center;

  &:focus {
    border-color: ${theme.colors.primary};
    outline: none;
  }
`;

export const SwitchWrapper = styled.div<{ isLeft: boolean }>`
  position: absolute;
  right: 15px;
  width: 38px;
  height: 12px;
  background-color: ${(props) => (props.isLeft ? '#c2c2c26f' : '#61a7fc45')};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const SwitcherCircle = styled.div<{ isLeft: boolean }>`
  height: 20px;
  width: 20px;
  background-color: ${(props) => (props.isLeft ? '#b5b5bc' : '#33ccff')};
  border-radius: 50%;
  position: absolute;
  transition: 0.3s;
  top: -4px;
  left: ${(props) => (props.isLeft ? '0px' : '18px')};
`;
