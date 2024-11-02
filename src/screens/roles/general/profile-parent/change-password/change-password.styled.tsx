import styled from "styled-components";

export const StyledLogo = styled.img`
    width: 300px;
    height: 121px;
    margin-left: -40px;
  
    @media (max-width: ${505}px) {
      width: auto;
      height: auto;
      margin-left: -40px;
    }
`;

export const AuthWrapper = styled.div`
    display: flex;
    height: 100vh;
    box-sizing: border-box;
    width: 100vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 35px;
    min-height: 660px;
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
`;
  