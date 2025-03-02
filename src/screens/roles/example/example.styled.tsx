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

export const AuthWrapper = styled.div<{height: number}>`
    display: flex;
    height: ${({ height }) => height}px;
    box-sizing: border-box;
    width: 100vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 35px;
    min-height: 660px;
`;
  