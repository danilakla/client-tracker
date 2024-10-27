import { FC, HTMLAttributes, memo } from "react";
import { StyledImage } from "./image.styles";

export type ImageProps = {
    src: string;
    width?: number;
    height?: number;
    widthDesktop?: number;
    heightDesktop?: number;
    alt?: string;
  } & HTMLAttributes<HTMLElement>;
  
  export const Image: FC<ImageProps> = memo(({ src, alt, width, height, widthDesktop, heightDesktop, ...rest }) => (
    <StyledImage 
      width={width} 
      height={height} 
      widthDesktop={widthDesktop} 
      heightDesktop={heightDesktop} 
      src={src} 
      alt={alt} 
      {...rest} 
    />
  ));
