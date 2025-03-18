import { FC, HtmlHTMLAttributes, memo, useCallback, useState } from "react";
import { ArrowButton, ItemsContainer, SelectContainer, SelectStyled, SelectWrapper } from "./select.styled";
import { Text } from "../text";
import { theme } from "../themes/theme";

import arrowSvg from '../assets/arrow-sekect.svg'
import { Popup } from "../popup";
import { ActionButton } from "../action-button";
import { Spacing } from "../spacing";
import { useMediaQuery } from "react-responsive";
import { Modal } from "../modal";
import { Column } from "../column";
import { Search } from "../search";
import { ScrollView } from "../scroll-view";

export type ItemOfSelectType = {
  name: string,
  value: string,
};

export type SelectProps = {
  themeColor?: string;
  includeSearch?: boolean;
  textColor?: string;
  borderColor?: string;
  header?: string;
  width?: number;
  items?: ItemOfSelectType[],
  selectedItem?: ItemOfSelectType,
  setValue: (value: ItemOfSelectType) => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const Select: FC<SelectProps> = memo(({
  borderColor = theme.colors.foreground, 
  themeColor = theme.colors.surface,
  textColor = theme.colors.gray, 
  includeSearch = false,
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

  const [searchText, setSearchText] = useState<string>('');

  const filteredItems = items?.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

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
          <Text 
            format='hide'
            style={{
              width: 'calc(100% - 25px)',
            }}

            themeFont={theme.fonts.ht1}>
              {selectedItem?.name}
          </Text>
          <ArrowButton rotate={isOpen} src={arrowSvg}/>
        </SelectStyled>
      </SelectContainer>
      {!isMobile ? (
      <Popup isActive={isOpen} closePopup={toggleSelect}>
        <PopupContent
          length={items?.length}
          header={header}
          includeSearch={includeSearch}
          searchText={searchText}
          setSearchText={setSearchText}
          filteredItems={filteredItems}
          onSet={onSet}
          />
      </Popup>) :(<Modal isActive={isOpen} closeModal={toggleSelect}>
        <ModalContent 
          length={items?.length}
          header={header}
          includeSearch={includeSearch}
          searchText={searchText}
          setSearchText={setSearchText}
          filteredItems={filteredItems}
          onSet={onSet}
          />
      </Modal>)}
    </SelectWrapper>
  );
});

export type ModalContentProps = {
  length?: number;
  header?: string;
  includeSearch: boolean;
  searchText: string;
  setSearchText: (value: string) => void;
  filteredItems?: ItemOfSelectType[];
  onSet: (item: ItemOfSelectType) => void;
}

export const ModalContent: FC<ModalContentProps> = memo(({ 
  length = 0,
  header,
  includeSearch,
  filteredItems = [],
  searchText,
  setSearchText,
  onSet
}) => 
  <Column>{
    length === 0 ? (<>
      <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
        Данные не найдены
      </Text>
      </>) : (<>
        {includeSearch && <>
            <Search value={searchText} setValue={setSearchText} />
            <Spacing variant='Column' themeSpace={15}/>
        </>}
        {header && <>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              {header}
            </Text>
            <Spacing variant='Column' themeSpace={10}/>
        </>}
        <ScrollView style={{maxHeight: 400}}>
        <ItemsContainer>
          {filteredItems?.map((item, index) => 
            <ActionButton key={index} onClick={() => onSet(item)} text={item.name}/>)}
        </ItemsContainer>
        { filteredItems.length === 0 && <Text themeColor={theme.colors.gray} themeFont={theme.fonts.ht2}>
          Совпадений не найдено
        </Text>}
        </ScrollView>
  </>)}
  </Column>
);

export type PopupContentProps = {
  length?: number;
  header?: string;
  includeSearch: boolean;
  searchText: string;
  setSearchText: (value: string) => void;
  filteredItems?: ItemOfSelectType[];
  onSet: (item: ItemOfSelectType) => void;
}

export const PopupContent: FC<ModalContentProps> = memo(({ 
  length = 0,
  header,
  includeSearch,
  filteredItems = [],
  searchText,
  setSearchText,
  onSet
}) => 
  <Column style={{width: 440}}>{
    length === 0 ? (<>
      <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
        Данные не найдены
      </Text>
      </>) : (<>
        {includeSearch && <>
            <Search value={searchText} setValue={setSearchText} />
            <Spacing variant='Column' themeSpace={15}/>
        </>}
        {header && <>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              {header}
            </Text>
            <Spacing variant='Column' themeSpace={10}/>
        </>}
        <ScrollView style={{maxHeight: 400}}>
        <ItemsContainer>
          {filteredItems?.map((item, index) => 
            <ActionButton key={index} onClick={() => onSet(item)} text={item.name}/>)}
        </ItemsContainer>
        { filteredItems.length === 0 && <Text themeColor={theme.colors.gray} themeFont={theme.fonts.ht1}>
          Совпадений не найдено
        </Text>}
        </ScrollView>
  </>)}
  </Column>
);