import { FC, HTMLAttributes, memo } from "react";
import eyeLogo from "../assets/eye.svg"
import noEyeLogo from "../assets/no-eye.svg"
import { theme } from "../themes/theme";
import { Text } from "../text";
import { Spacing } from "../spacing";
import { CheckboxContainer, CheckboxMark } from "./checkbox.styles";

import checkMarkIcon from '../assets/checkmark.svg'
import { Row } from "../row";


export type CheckboxProps = {
  size?: number;
  label: string;
  value: boolean;
  toggle: () => void;
  themeColor?: string;
  borderColor?: string;
  borderRadius?: number;
} & HTMLAttributes<HTMLInputElement>;

export const Checkbox: FC<CheckboxProps> = memo(({
  size = 42.4,
  value,
  borderColor = theme.colors.foreground, 
  themeColor = theme.colors.surface,
  borderRadius = 10,
  label,
  toggle
}) => {


  return (
    <Row verticalAlign='center' style={{flexShrink: 0}}>
      <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
        {label}
      </Text>
      <Spacing variant='Row' themeSpace={5} />
      <CheckboxContainer
        size={size}
        onClick={toggle}
        themeColor={themeColor}
        borderColor={borderColor}
        borderRadius={borderRadius}>
      {value && <CheckboxMark src={checkMarkIcon}/>}
      </CheckboxContainer>
    </Row>
    
  );
});

