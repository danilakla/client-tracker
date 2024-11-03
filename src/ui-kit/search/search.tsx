import { ChangeEvent, FC, HTMLAttributes, memo } from "react";
import { theme } from "../themes/theme";
import { SearchContainer, SearchIcon, SearchStyled, SearchWrapper } from "./search.styles";

import searchSVG from '../assets/search.svg';

export type SearchProps = {
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  width?: number;
  value?: string;
  maxLength?: number;
  minLength?: number;
  isMobile?: boolean;
  required?: boolean;
  setValue?: (value: string) => void;
} & HTMLAttributes<HTMLInputElement>;

export const Search: FC<SearchProps> = memo(({
  borderColor = theme.colors.foreground, 
  themeColor = theme.colors.surface,
  textColor = theme.colors.gray, 
  setValue, 
  value, 
  isMobile = true,
  width, 
  minLength, 
  maxLength,
  ...rest 
}) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (setValue !== undefined) {
      setValue(event.target.value);
    }
  };

  return (
    <SearchWrapper isMobile={isMobile} width={width}>
      <SearchContainer>
        <SearchStyled
          themeColor={themeColor}
          textColor={textColor}
          borderColor={borderColor}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={'Поиск...'}
          onChange={handleInputChange}
          value={value}
          type={'text'}
          {...rest}
        >
        </SearchStyled>
        <SearchIcon src={searchSVG}/>
      </SearchContainer>
    </SearchWrapper>
  );
});

