import styled from "styled-components";
import { theme } from "../../ui-kit/themes/theme";

export const HeaderContainer = styled.div`
    position: fixed; 
    display: flex;
    top: 0;
    z-index: 10;
    height: 60px;
    justify-content: center;
    align-items: center;
    width: 100vw;
    background-color: #ffffff;
    box-shadow: 0 0 4px 2px #8f8fbf25;
    border-bottom: 2px solid #e9e9f2;
`;

export const ControlPanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    height: auto;
    padding: 15px 10px;
    background-color: #ffffff;
    box-shadow: 0 0 4px 2px #8f8fbf25;
    border: 2px solid #e9e9f2;
`;

export const ControlPanelWrapper = styled.div`
    position: fixed; 
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    left: 25px;
    width: auto;
    height: 100vh;
`;

export const ImageButtonStyled = styled.img`
    cursor: pointer;
    width: 25px;
    height: 25px;
`;

export const ImageArrowButton = styled.img`
    width: 10px;
    height: 10px;
`;

export const ScreenContent = styled.div<{ isCenter?: boolean }>`
  padding:  95px 110px 0px 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  height: 100vh;
  overflow: auto;

  ${({ isCenter }) =>
    isCenter &&
    `
    min-height: 740px;  
    justify-content: center;
  `}
`;

export const Wrapper = styled.div`
    min-height: 740px;
`;

export const BackButton = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 25px;
    height: 50px;
    justify-content: center;
    align-items: center;

`;

export const SelectedButtonWrapper = styled.div<{isAvctive: boolean}>`
    background: ${({ isAvctive }) => isAvctive ?  theme.colors.primary : theme.colors.surface};
    padding: 7px;
    display: flex;
    margin: 0;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`;