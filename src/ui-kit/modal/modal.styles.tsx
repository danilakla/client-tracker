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
    pointer-events: ${({ isActive }) => (isActive ? "all" : "none")};
    z-index: 1000;
    background: rgba(24, 24, 24, 0.11);
    background-color: rgba(0, 0, 0, 0.6);

    opacity: ${({ isActive }) => (isActive ? "1" : "0")};
    transition: opacity 0.1s ease;

    & > .modal-content {
        transform: ${({ isActive }) => (isActive ? "translateY(0)" : "translateY(100%)")};
        transition: transform 0.3s ease;
    }
`;
