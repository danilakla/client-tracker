import styled from "styled-components";

export const GridContainerStyled = styled.div<{
  gap?: number;
  columns?: number;
  width?: string;
}>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columns }) => columns || 4}, 
    minmax(0, 1fr)
  );
  gap: ${({ gap }) => (gap ? `${gap}px` : '25px')};
  width: ${({ width }) => (width ? `${width}` : '100%')} ;
  height: 100%;
  overflow: auto;
  padding-bottom: 65px
`;
