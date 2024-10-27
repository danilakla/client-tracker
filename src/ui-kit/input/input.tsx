import { ChangeEvent, FC, HTMLAttributes, memo, useCallback, useState } from "react";
import { InputButton, InputContainer, InputStyled, InputWrapper } from "./input.styles";
import eyeLogo from "../assets/eye.svg"
import noEyeLogo from "../assets/no-eye.svg"
import { theme } from "../themes/theme";
import { Text } from "../text";
import { Spacing } from "../spacing";
import { error } from "console";

export type InputProps = {
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  placeholder?: string;
  header?: string;
  width?: number;
  value?: string;
  type?: "text" | "password";
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: null | string;
  setValue?: (value: string) => void;
} & HTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = memo(({
  borderColor = theme.colors.gray, 
  themeColor = theme.colors.surface,
  textColor = theme.colors.gray, 
  header,
  setValue, 
  disabled = false, 
  value, 
  error,
  width, 
  placeholder, 
  type = "text", 
  minLength, 
  maxLength,
  ...rest 
}) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (setValue !== undefined) {
      setValue(event.target.value);
    }
  };

  const [isShowPassword, setIsShowPassword] = useState<Boolean>(false);

  const onClickWatch = useCallback(() => {
    setIsShowPassword(!isShowPassword);
  }, [isShowPassword]);

  return (
    <InputWrapper width={width}>
      {header && <>
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            {header}
          </Text>
          <Spacing variant='Column' themeSpace={5}/>
      </>}
      <InputContainer>
        <InputStyled
          themeColor={themeColor}
          textColor={textColor}
          borderColor={borderColor}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          value={value}
          type={type === 'password' && isShowPassword ? 'text' : type}
          {...rest}
        >
        </InputStyled>
          {type === "password" && <InputButton onClick={onClickWatch} src={isShowPassword ? eyeLogo : noEyeLogo }/>}
      </InputContainer>
      {error && <Text 
        style={{
          position: 'absolute', 
          marginTop: 45,
          marginLeft: 5,
          width: '90%', 
          wordBreak: 'break-word',
        }} 
        themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
          {error}
      </Text>}
    </InputWrapper>
  );
});

