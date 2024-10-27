import styled from "styled-components";

export const WrapperPopap = styled.div<{
    isActive: boolean;
}>`
    width: 100vw;
    height: 100vh;
    z-index: 100;
    box-sizing: border-box;
    top: 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    background: rgba(24, 24, 24, 0.11);
    left: 0;
    background-color: rgba(0,0,0,0.6);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    display: ${({ isActive }) => isActive? "flex" : "none"};
    pointer-events: ${({ isActive }) => isActive? "all" : "none"};
    transition: 0.5s;
`