import styled from "styled-components";
import { theme } from "../../../../../ui-kit/themes/theme";


export const ScrollWrapper = styled.div`
  width: 100%;
  overflow: auto;

  max-height: 140px;

  @media (min-height: 610px) {
    max-height: 210px;
  }

  @media (min-height: 680px) {
    max-height: 280px;
  }

  @media (min-height: 750px) {
    max-height: 350px;
  }

  @media (min-height: 820px) {
    max-height: 420px;
  }

  @media (min-height: 890px) {
    max-height: 490px;
  }

  @media (min-height: 960px) {
    max-height: 560px;
  }

  @media (min-height: 1030px) {
    max-height: 630px;
  }

  @media (min-height: 1100px) {
    max-height: 700px;
  }
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
  cursor: pointer;
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

export const ColorCircleButton = styled.div<{variant: 0 | 1 | 2 | 3, isSelected: boolean}>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;

  border: ${({ isSelected }) => (isSelected ? `5px solid ${theme.colors.gray}` : "none")};

  background-color: ${({ variant }) => {
    switch(variant){
      case 0:
        return `#0000003e`;
      case 1:
        return `${theme.colors.attentive}`;
      case 2:
        return `${theme.colors.neutral}`;
      case 3:
        return `${theme.colors.success}`;
    }
  }};
`;