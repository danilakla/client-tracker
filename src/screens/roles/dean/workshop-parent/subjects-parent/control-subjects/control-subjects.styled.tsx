import styled from "styled-components";

export const ItemsContainerMobile = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  max-width: 440px;
  flex-direction: column;
  gap: ${(props) => '10px'};
  height: 100%;
  overflow: auto;
  padding-bottom: 85px;
`;