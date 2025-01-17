import { FC, HtmlHTMLAttributes, memo, ReactNode, useState } from "react";
import { SliderContainer, SliderInput } from "./range-slider.styles";
import { Text } from "../text";
import { theme } from "../themes/theme";
import { Spacing } from "../spacing";
import { Row } from "../row";

export type RangeSliderProps = {
  maxValue?: number;
  minValue?: number;
  step?: number;
  children?: ReactNode;
  width?: number;
  value: number;
  setValue: (value: number) => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const RangeSlider: FC<RangeSliderProps> = memo(({ 
  minValue = 10,
  maxValue = 180,
  step=10,
  width,
  value,
  children, 
  setValue,
  ...rest }) =>{

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return(
    <SliderContainer {...rest}>
      <SliderInput
        type="range"
        min={minValue}
        max={maxValue}
        step={step} 
        value={value}
        onChange={handleChange}
      />
    </SliderContainer>)
});