import styled from "styled-components";
import { theme } from "../../../../../ui-kit/themes/theme";

export const ColorCircleButton = styled.div<{color: string, isSelected: boolean}>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;

  border: ${({ isSelected }) => (isSelected ? `5px solid ${theme.colors.primary}` : "none")};

  background-color: ${({ color }) => color};
`;

export const ScrollWrapper = styled.div`
  width: 100%;
  overflow: auto;

  max-height: 210px;

  @media (min-height: 670px) {
    max-height: 210px;
  }

  @media (min-height: 740px) {
    max-height: 280px;
  }

  @media (min-height: 810px) {
    max-height: 350px;
  }

  @media (min-height: 880px) {
    max-height: 420px;
  }

  @media (min-height: 950px) {
    max-height: 490px;
  }

  @media (min-height: 1020px) {
    max-height: 560px;
  }

  @media (min-height: 1080px) {
    max-height: 630px;
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

export const ClassItem = styled.div<{isReview?: boolean, isPassed?: boolean}>`
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
  background-color: ${({ isReview, isPassed }) => isPassed ? '#16d97735' : isReview ? '#fc6e6c79' : 'transparent'};
`;

export const EmptyClassItem = styled.div`
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
  border-right: 0 !important;
  background-color: #d3d3d376;
`;

export const TableWrapper = styled.div`

`;

export const NameHeader = styled.div<{isHide: boolean}>`
  display: flex;
  align-items: center;
  width: ${({ isHide }) => isHide ? "162px" : "140px"};
  flex-shrink: 0;
`;

export const HeaderClassItem = styled.div`
  display: flex;
  flex-direction: column;
  writing-mode: vertical-rl;
  position: relative;
  align-items: flex-start;
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;
  flex: 0 0 70px;
  transform: rotate(180deg);
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


export const ColorCircle = styled.div<{color: string}>`
  width: 15px;
  height: 15px;
  border-radius: 50%;

  background: ${({ color }) => color};
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



export const HorizontalTrack = styled.div`
  position: relative;
  height: 12px;
  width: calc(100% - 162px);
  background: #eee;
  border-radius: 10px;
  cursor: pointer;
`;

export const HorizontalSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 100%;
  background: ${theme.colors.primary};
  border-radius: 10px;
  cursor: grab;
`;


export const VerticalTrack = styled.div`
  position: relative;
  width: 12px;
  background: #eee;
  border-radius: 10px;
  cursor: pointer;
`;

export const VerticalSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: ${theme.colors.primary};
  border-radius: 10px;
  cursor: grab;
`;
