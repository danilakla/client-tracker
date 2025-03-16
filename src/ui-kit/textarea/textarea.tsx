import { ChangeEvent, FC, HTMLAttributes, memo, useCallback } from "react";
import { CopyButton, TextareaContainer, TextareaStyled, TextareaWrapper } from "./textarea.styles";
import { theme } from "../themes/theme";
import { Text } from "../text";
import { Spacing } from "../spacing";

import copySVG from '../assets/copy-svg.svg'

export type TextareaProps = {
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  placeholder?: string;
  header?: string;
  width?: number;
  height?: number;
  value?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  isCopy?: boolean;
  disabled?: boolean;
  error?: null | string;
  setValue?: (value: string) => void;
} & HTMLAttributes<HTMLTextAreaElement>;

export const Textarea: FC<TextareaProps> = memo(({
  borderColor = theme.colors.foreground, 
  themeColor = theme.colors.surface,
  textColor = theme.colors.gray, 
  header,
  setValue, 
  height,
  isCopy=false,
  disabled = false, 
  value, 
  error,
  width, 
  placeholder, 
  minLength, 
  maxLength,
  ...rest 
}) => {

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (setValue !== undefined) {
      setValue(event.target.value);
    }
  };

  const copyToClipboard = useCallback(() => {
    if (value) {
      navigator.clipboard.writeText(value).then(
        () => {
          console.log("Copied to clipboard successfully!");
        },
        (err) => {
          console.error("Failed to copy to clipboard:", err);
        }
      );
    }
  }, [value]);

  return (
    <TextareaWrapper width={width}>
      {header && <>
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            {header}
          </Text>
          <Spacing variant='Column' themeSpace={5}/>
      </>}
      <TextareaContainer>
        <TextareaStyled
          themeColor={themeColor}
          textColor={textColor}
          height={height}
          borderColor={error ? theme.colors.attentive : borderColor}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleTextAreaChange}
          value={value}
          {...rest}
        >
        </TextareaStyled>
        {isCopy && <CopyButton onClick={copyToClipboard} src={copySVG}/>}
      </TextareaContainer>
      {error && <Text 
        style={{
          position: 'absolute', 
          marginTop: height ? height + 25 : 125,
          marginLeft: 5,
          width: '97%', 
          fontSize: 12,
          wordBreak: 'break-word',
        }} 
        themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
          {error}
      </Text>}
    </TextareaWrapper>
  );
});

