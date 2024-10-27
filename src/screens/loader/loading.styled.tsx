import styled, { keyframes } from 'styled-components';

export const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const rotateOne = keyframes`
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
`;

export const rotateTwo = keyframes`
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
`;

export const rotateThree = keyframes`
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
`;

export const LoaderContainer = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  perspective: 800px;
`;

export const Inner = styled.div`
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const One = styled(Inner)`
  left: 0;
  top: 0;
  animation: ${rotateOne} 1s linear infinite;
  border-bottom: 3px solid #33CCFF;
`;

export const Two = styled(Inner)`
  right: 0;
  top: 0;
  animation: ${rotateTwo} 1s linear infinite;
  border-right: 3px solid #33CCFF;
`;

export const Three = styled(Inner)`
  right: 0;
  bottom: 0;
  animation: ${rotateThree} 1s linear infinite;
  border-top: 3px solid #33CCFF;
`;
