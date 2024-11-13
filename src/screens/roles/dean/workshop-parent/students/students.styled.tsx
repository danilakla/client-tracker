import styled from "styled-components";

export const ScreenContainer = styled.div<{ currentScreen: 'all' | 'subgroup' | 'student' }>`
  display: flex;
  width: 300vw; 
  transition: transform 0.3s ease;
  touch-action: pan-y; 

  transform: ${({ currentScreen }) => {
    switch (currentScreen) {
      case 'all':
        return 'translateX(100vw)';
      case 'subgroup':
        return 'translateX(0vw)';
      case 'student':
        return 'translateX(-100vw)';
      default:
        return 'translateX(0)';
    }
  }};

  > div {
    width: 100vw;
    padding: 0px 25px;
  }
`;
