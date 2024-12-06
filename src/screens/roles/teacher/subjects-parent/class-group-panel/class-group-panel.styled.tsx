import styled from "styled-components";
import { theme } from "../../../../../ui-kit/themes/theme";


export const ScrollWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 200px;
`;

export const Table = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const StudentItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 70px;
  gap: 3px;
  width: 140px;
  flex-shrink: 0;
  border-right: 1px solid #52526655;
`;

export const StudentsContainer = styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    border-bottom: 2px solid ${theme.colors.primary};
  }

  & > div:last-child {
    border-bottom: none;
  }
`;

export const ClassesRow = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
      
  & > div {
    border-right: 1px solid #52526655;
  }

  & > div:last-child {
    border-right: none;
  }
`;

export const ClassesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: scroll;

  & > div {
    & > div {
      border-bottom: 2px solid ${theme.colors.primary};
    }
  }

  & > div:last-child {
    & > div {
      border-bottom: none;
    }
  }
`;

export const ClassItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  gap: 5px;
  height: 70px;
  flex: 0 0 70px;
`;

export const TableWrapper = styled.div`

`;


export const NameHeader = styled.div`
  display: flex;
  align-items: center;
  width: 140px;
  flex-shrink: 0;
`;



export const HeaderClassItem = styled.div`
  display: flex;
  writing-mode: vertical-rl;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  flex: 0 0 70px;
`;

export const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 100%;
  height: 100px;
`;

export const HeaderClasses = styled.div`
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  width: 100%;
`;


export const ColorCircle = styled.div<{variant: 0 | 1 | 2 | 3}>`
  width: 10px;
  height: 10px;
  border-radius: 5px;

  background-color: ${({ variant }) => {
    switch(variant){
      case 0:
        return `transparent`;
      case 1:
        return `${theme.colors.attentive}`;
      case 2:
        return `${theme.colors.neutral}`;
      case 3:
        return `${theme.colors.success}`;
    }
  }};
`;


export const ExistMark = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: ${theme.colors.primary};
  clip-path: polygon(0 0, 100% 0, 0 100%);
  left: 0;
  top: 0;
`;