import styled from "styled-components";

export const WrapperModal = styled.div<{
    isActive: boolean;
}>`
    width: 100vw;
    height: 100dvh;
    top: 0;
    left: 0;
    position: fixed;
    will-change: opacity, transform;
    display: flex;
    align-items: flex-end;
    pointer-events: ${({ isActive }) => (isActive ? "all" : "none")};
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.3);

    visibility: ${({ isActive }) => (isActive ? "visible" : "hidden")};
    opacity: ${({ isActive }) => (isActive ? "1" : "0")};
    transition: opacity 0.1s ease;

    & > .modal-content {
        transform: ${({ isActive }) => (isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)")};
        transition: transform 0.3s ease;
    }
`;
