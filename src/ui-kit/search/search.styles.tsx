import styled from "styled-components";
import { theme } from "../themes/theme";

export const SearchWrapper = styled.div<{ width?: number, isMobile?: boolean }>`
  display: flex;
  position: relative;
  flex-direction: column;
  width: ${props => props.width? `${props.width}px` : '100%'};
  max-width: ${props => props.isMobile ? `440px` : '100%'};
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  padding: 0px;
`;

export const SearchStyled = styled.input<{
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
}>`
  width: 100%;
  autocomplete: off;
  box-shadow: 0 0 16px 5px #8f8fbf40;
  box-sizing: border-box;
  border: 2px solid ${({ borderColor }) => borderColor};
  padding: 10px 10px 10px 40px;
  display: flex;
  border-radius: 10px;
  background-color: ${({ themeColor }) => themeColor};
  color: ${({ textColor }) => textColor};

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

export const SearchIcon = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  left: 14px;
  border: 0px;
  cursor: pointer;
`;
