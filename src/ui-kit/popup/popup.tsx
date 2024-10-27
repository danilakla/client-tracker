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
          if (isActive) {
            event.preventDefault();
            event.stopPropagation();
          }
        };
        if (isActive) {
          document.body.style.overflow = "hidden";
          document.body.addEventListener("scroll", handleScroll, {
            passive: false,
          });
        } else {
          document.body.style.overflow = "";
          document.body.removeEventListener("scroll", handleScroll);
        }
        return () => {
          document.body.style.overflow = "";
          document.body.removeEventListener("scroll", handleScroll);
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
