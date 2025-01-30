import styled from "styled-components";
import { theme } from "../themes/theme";

export type StyledButtonProps = {
  variant: 'primary' | 'attentive' | 'recomended';
  borderRaius?: number;
  width?: number | string;
  height?: number | string;
  padding?: number | [number?, number?, number?, number?];
};

export const StyledButton = styled.button<StyledButtonProps>`
  border: 0;
  padding: 0;
  position: relative;
  margin: 0;
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px 2px #8f8fbf30;

  background: ${({ variant }) => {
    switch(variant){
      case 'primary':
        return `${theme.colors.primary}`;
      case 'recomended':
        return `${theme.colors.success}`;
      case 'attentive':
        return `${theme.colors.attentive} `;
    }
  }};

  border: none;

  padding: ${({ padding }) => {
    if (typeof padding === "number") {
      return `${padding}px`;
    }
    if (Array.isArray(padding)) {
      if (padding.length === 1) {
        return padding[0];
      }
      if (padding.length === 2) {
        return `${padding[0]}px ${padding[1]}px`;
      }
      if (padding.length === 4) {
        return `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`;
      }
    }
    return "0";
  }};

  width: ${props => {
    if(props.width){
      if(typeof props.width === "number") return props.width + "px"; 
      else return props.width;
    }
    else return "auto";
  }};
  
  height: ${props => {
    if(props.height){
      if(typeof props.height === "number") return props.height + "px"; 
      else return props.height;
    }
    else return "auto";
  }};

  border-radius: ${({ borderRaius }) => `${borderRaius}px` || '20px'};
`;
