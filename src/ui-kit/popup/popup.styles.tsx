import styled from "styled-components";

export const WrapperPopap = styled.div<{
    isActive: boolean;
}>`
    width: 100vw;
    height: 100vh;
    z-index: 1000;
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
    pointer-events: ${({ isActive }) => isActive? "all" : "none"};
    opacity: ${({ isActive }) => (isActive ? "1" : "0")};
    visibility: ${({ isActive }) => (isActive ? "visible" : "hidden")};
    transition: opacity 0.3s ease, visibility 0.5s ease;
`