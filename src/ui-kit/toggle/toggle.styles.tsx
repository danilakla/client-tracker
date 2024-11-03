import styled from 'styled-components';
import { theme } from '../themes/theme';

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ToggleButton = styled.button<{ active: boolean }>`
  margin: 5px 0;
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  position: relative;
`;

export const Line = styled.div<{ active: boolean }>`
width: ${(props) => (props.active ? '100%' : '0')};
height: 2px;
background-color: ${theme.colors.primary};
position: absolute;
bottom: -2px;
left: 0;
transition: width 0.3s ease;
`;