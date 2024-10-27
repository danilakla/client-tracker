import { FC, HtmlHTMLAttributes, ReactNode, memo, useEffect } from "react";
import { WrapperModal } from "./modal.styles";
import { Surface } from "../surface";

type ModalProps = {
    isActive : boolean,
    themeColor?: string,
    closeModal: () => void,
    borderRadius?: number,
    padding?: string,
    children?: ReactNode
}  & HtmlHTMLAttributes<HTMLElement>;;
  
export const Modal: FC<ModalProps> = memo(({ 
  isActive, 
  closeModal, 
  children, 
  themeColor,
  borderRadius = 25,
  padding = '25px',
  ...rest }) => {
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
      <WrapperModal isActive={isActive} onClick={closeModal}>
        <Surface 
          style={{ zIndex: 10000 }} 
          themeColor={themeColor} 
          borderRadius={`${borderRadius}px ${borderRadius}px 0px 0px`} 
          padding={padding} 
          onClick={(e) => e.stopPropagation()} {...rest}>
          {children}
        </Surface>
      </WrapperModal>
    )
});
