import styled from "styled-components";

export const ScreenContainer = styled.div<{ currentScreen: 'members' | 'details' }>`
  display: flex;
  width: 200vw; 
  transition: transform 0.3s ease;
  touch-action: pan-y; 

  transform: ${({ currentScreen }) => {
    switch (currentScreen) {
      case 'members':
        return 'translateX(50vw)';
      case 'details':
        return 'translateX(-50vw)';
      default:
        return 'translateX(0)';
    }
  }};

  > div {
    flex: 0 0 100vw;
    padding: 0px 25px;
  }
`;