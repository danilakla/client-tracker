import styled from "styled-components";

export const HeaderContainer = styled.div`
    position: fixed; 
    display: flex;
    top: 0;
    z-index: 10;
    height: 50px;
    justify-content: center;
    align-items: center;
    width: 100vw;
    background-color: #ffffff;
    box-shadow: 0 0 16px 0 #8f8fbf40;
`;

export const BottomContainer = styled.div`
    position: fixed; 
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 33px;
    bottom: 0;
    height: 60px;
    width: 100vw;
    background-color: #ffffff;
    box-shadow: 0 0 16px 0 #8f8fbf40;
    
`;

export const ImageButtonStyled = styled.img`
    cursor: pointer;
    width: 32px;
    height: 32px;
`;

export const ImageArrowButton = styled.img`
    width: 10px;
    height: 10px;
`;

export const ScreenContent = styled.div`
    padding: 75px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Wrapper = styled.div`
    position: relative;
`;

export const BackButton = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    position: absolute;
    left: 12px;
    height: 50px;
    justify-content: center;
    align-items: center;

`;