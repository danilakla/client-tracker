import styled from "styled-components";

export const WrapperPopap = styled.div<{
    isActive: boolean;
    height: number;
}>`
    width: 100vw;
    height: ${({ height }) => height}px;
    z-index: 1000;
    box-sizing: border-box;
    top: 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    background: rgba(24, 24, 24, 0.11);
    left: 0;
    background-color: rgba(0,0,0,0.3);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: ${({ isActive }) => (isActive ? "all" : "none")};
    opacity: ${({ isActive }) => (isActive ? "1" : "0")};
    visibility: ${({ isActive }) => (isActive ? "visible" : "hidden")};
    transition: 
        opacity ${({ isActive }) => (isActive ? "0.20s" : "0.005s")} ease-in,
        visibility 0s ${({ isActive }) => (isActive ? "0s" : "0.2s")};
`