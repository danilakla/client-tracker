import { FC, HtmlHTMLAttributes, memo, useCallback, useState } from "react";
import { ArrowButton, SelectContainer, SelectStyled, SelectWrapper } from "./select.styled";
import { Text } from "../text";
import { theme } from "../themes/theme";

import arrowSvg from '../assets/arrow-sekect.svg'
import { Popup } from "../popup";
import { ActionButton } from "../action-button";
import { Spacing } from "../spacing";
import { useMediaQuery } from "react-responsive";
import { Modal } from "../modal";

export type ItemOfSelectType = {
  name: string,
  value: string,
};

export type SelectProps = {
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  header?: string;
  width?: number;
  items?: ItemOfSelectType[],
  selectedItem?: ItemOfSelectType,
  setValue: (value: ItemOfSelectType) => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const Select: FC<SelectProps> = memo(({
  borderColor = theme.colors.gray, 
  themeColor = theme.colors.surface,
  textColor = theme.colors.gray, 
  header,
  width,
  items,
  selectedItem,
  setValue,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const onSet = useCallback((item: ItemOfSelectType) => {
    setValue(item);
    setIsOpen(false);
  },[setValue,setIsOpen])

  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return(
    <SelectWrapper>
      {header && <>
        <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
          {header}
        </Text>
        <Spacing variant='Column' themeSpace={5}/>
      </>}
      <SelectContainer>
        <SelectStyled 
          themeColor={themeColor}
          textColor={textColor}
          onClick={toggleSelect}
          borderColor={isOpen ? theme.colors.primary : borderColor}
          {...rest}>
          <Text themeFont={theme.fonts.ht1}>
              {selectedItem?.name}
          </Text>
          <ArrowButton rotate={isOpen} src={arrowSvg}/>
        </SelectStyled>
      </SelectContainer>
      {!isMobile ? (<Popup isActive={isOpen} closePopup={toggleSelect}>
        {header && <>
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            {header}
          </Text>
          <Spacing variant='Column' themeSpace={15}/>
        </>}
        {
          items?.map((item, index) => <>
            <ActionButton onClick={() => onSet(item)} width="440px" text={item.name}/>
            {index < items.length - 1 && <Spacing themeSpace={10} variant='Column' />}
          </>)
        }
      </Popup>) :(<Modal isActive={isOpen} closeModal={toggleSelect}>
        {header && <>
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            {header}
          </Text>
          <Spacing variant='Column' themeSpace={15}/>
        </>}
        {
          items?.map((item, index) => <>
            <ActionButton onClick={() => onSet(item)} text={item.name}/>
            {index < items.length - 1 && <Spacing themeSpace={15} variant='Column' />}
          </>)
        }
      </Modal>)}
    </SelectWrapper>
  );
});