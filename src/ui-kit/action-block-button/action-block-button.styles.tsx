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

export const ActionBlockButtonStyled = styled.div<{
  size?: number;
  themeColor?: string;
  textColor?: string;
  borderRadius?: number;
}>`
  width: ${({size}) => `${size || '155'}px`};
  cursor: pointer;
  height: ${({size}) => `${size || '155'}px`};
  border-radius: ${({borderRadius}) => `${borderRadius || '30'}px`};
  box-shadow: 0 0 4px 2px #8f8fbf15;
  box-sizing: border-box;
  display: flex;
  border: 2px solid #e9e9f2;
  flex-direction: column;
  padding: 25px;
  background-color: ${({ themeColor }) => themeColor};
  align-items: center;
  justify-content: center;

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