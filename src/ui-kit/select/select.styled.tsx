import styled from "styled-components";
import { theme } from "../themes/theme";

export const StyledSelect = styled.div`
  
`;

export const SelectWrapper = styled.div<{ width?: number }>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: ${props => props.width? `${props.width}px` : '100%'};
  max-width: 440px;
`;

export const SelectContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
`;

export const SelectStyled = styled.div<{
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
}>`
  width: 100%;
  cursor: pointer;
  box-shadow: 0 0 10px 5px rgba(221, 221, 221, 1);
  box-sizing: border-box;
  border: 2px solid ${({ borderColor }) => borderColor};
  padding: 10px 10px 10px 10px;
  display: flex;
  border-radius: 10px;
  background-color: ${({ themeColor }) => themeColor};
  color: ${({ textColor }) => textColor};
  font-family: ${theme.fonts.ht1.family};
  font-weight: ${theme.fonts.ht1.weight};
  color: ${theme.fonts.ht1};
  font-size: ${theme.fonts.ht1.desktopSize};
  align-items: center;

  @media (max-width: ${theme.toMobileSize + "px"}){
    font-size: ${theme.fonts.ht1.mobileSize};
  }

`;

export const ArrowButton = styled.img<{ rotate: boolean }>`
  position: absolute;
  width: 13px;
  height: 10px;
  right: 14px;
  border: 0px;
  cursor: pointer;
  transform: ${({ rotate }) => (rotate ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease-in-out;
`;
