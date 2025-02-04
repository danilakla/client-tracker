import { FC, HTMLAttributes, memo } from "react";
import eyeLogo from "../assets/eye.svg"
import noEyeLogo from "../assets/no-eye.svg"
import { theme } from "../themes/theme";
import { Text } from "../text";
import { Spacing } from "../spacing";
import { CheckboxContainer, CheckboxMark } from "./checkbox.styles";

import checkMarkIcon from '../assets/checkmark.svg'


export type CheckboxProps = {
  size?: number;
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
  toggle
}) => {


  return (
    <CheckboxContainer
      size={size}
      onClick={toggle}
      themeColor={themeColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
    >
     {value && <CheckboxMark src={checkMarkIcon}/>}
    </CheckboxContainer>
  );
});

