import styled from "styled-components";

export const WrapperModal = styled.div<{
    isActive: boolean;
}>`
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    position: fixed;
    display: flex;
    align-items: flex-end;
    display: ${({ isActive }) => isActive? "flex" : "none"};
    pointer-events: ${({ isActive }) => isActive? "all" : "none"};
    transition: 0.5s;
    z-index: 1000;
    background: rgba(24, 24, 24, 0.11);
    background-color: rgba(0,0,0,0.6);
`