import { FC, HtmlHTMLAttributes, memo, ReactNode } from "react";
import { SliderContainer, SliderInput } from "./range-slider.styles";

export type RangeSliderProps = {
  maxValue?: number;
  minValue?: number;
  step?: number;
  children?: ReactNode;
  width?: number;
  value: number;
  disabled?: boolean;
  setValue: (value: number) => void;
} & HtmlHTMLAttributes<HTMLElement>;

export const RangeSlider: FC<RangeSliderProps> = memo(({ 
  minValue = 10,
  maxValue = 180,
  step=10,
  width,
  disabled=false,
  value,
  children, 
  setValue,
  ...rest }) =>{

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  return(
    <SliderContainer {...rest}>
      <SliderInput
        type="range"
        min={minValue}
        disabled={disabled}
        max={maxValue}
        step={step} 
        value={value}
        onChange={handleChange}
      />
    </SliderContainer>)
});