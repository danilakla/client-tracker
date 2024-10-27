import { FC, HtmlHTMLAttributes, memo } from "react";
import { ContainerCircleLoading, StyledCircleLoading } from "./circle-loading.styles";

export type CircleLoadingProps = {
  color?: string;
  size?: number;
  state?: "idle" | "loading" | "success" | "error";
} & HtmlHTMLAttributes<HTMLElement>;
  
export const CircleLoading: FC<CircleLoadingProps> = memo(({state = 'idle', color, size, ...rest }) => 
  <ContainerCircleLoading>
    { state === 'loading' && <StyledCircleLoading size={size} color={color} {...rest}/>}
  </ContainerCircleLoading>
);
  