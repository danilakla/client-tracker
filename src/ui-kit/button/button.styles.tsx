import styled from "styled-components";
import { theme } from "../themes/theme";

export type StyledButtonProps = {
  variant: 'primary' | 'secondary' | 'attentive';
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

  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  
  color: ${({ variant }) => {
    switch(variant){
      case 'primary':
        return `${theme.colors.surface}`;
      case 'secondary':
        return `${theme.colors.gray}`;
      case 'attentive':
        return `${theme.colors.surface} `;
      default:
        return `${theme.colors.surface}`;
    }
  }};

  background: ${({ variant }) => {
    switch(variant){
      case 'primary':
        return `${theme.colors.gradients.primary}`;
      case 'secondary':
        return `${theme.colors.surface}`;
      case 'attentive':
        return `${theme.colors.attentive} `;
      default:
        return `${theme.colors.gradients.primary}`;
    }
  }};

  border: ${({ variant }) => {
    switch(variant){
      case 'primary':
        return `none`;
      case 'secondary':
        return `2px solid ${theme.colors.gray}`;
      case 'attentive':
        return `none`;
      default:
        return `none`;
    }
  }};

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
