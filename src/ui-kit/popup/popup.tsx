import { FC, HtmlHTMLAttributes, ReactNode, memo, useEffect } from "react";
import { WrapperPopap } from "./popup.styles";
import { Surface } from "../surface";

type PopupProps = {
    isActive : boolean,
    closePopup: () => void,
    padding?: string,
    children?: ReactNode
}  & HtmlHTMLAttributes<HTMLElement>;;
  
export const Popup: FC<PopupProps> = memo(({ isActive, closePopup, children, padding = '25px',...rest }) => {
    useEffect(() => {
      const handleScroll = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
      };

      if (isActive) {
          document.body.style.overflow = "hidden";
          document.addEventListener("wheel", handleScroll, { passive: false });
          document.addEventListener("touchmove", handleScroll, { passive: false });
      } else {
          document.body.style.overflow = "";
          document.removeEventListener("wheel", handleScroll);
          document.removeEventListener("touchmove", handleScroll);
      }

      return () => {
          document.body.style.overflow = "";
          document.removeEventListener("wheel", handleScroll);
          document.removeEventListener("touchmove", handleScroll);
      };
    }, [isActive]);
    
    return (
      <WrapperPopap isActive={isActive} onClick={closePopup}>
        <Surface style={{width: 'auto'}} padding={padding} onClick={(e) => e.stopPropagation()} {...rest}>
          {children}
        </Surface>
      </WrapperPopap>
    )
});
