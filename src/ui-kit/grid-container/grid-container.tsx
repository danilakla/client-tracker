import { FC, HTMLAttributes, memo } from "react";
import { GridContainerStyled } from "./grid-container.styles";

export type GridContainerProps = {
  gap?: number;
  columns?: number;
  width?: string;
} & HTMLAttributes<HTMLElement>;
  
export const GridContainer: FC<GridContainerProps> = memo(({gap, width, columns,...rest }) => (
  <GridContainerStyled 
    gap={gap} 
    columns={columns} 
    width={width}
    {...rest} 
  />
));
