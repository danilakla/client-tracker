
import { FC, memo } from 'react';
import { AppContainer, LoaderContainer, One, Three, Two } from './loading.styled';

export const LoaderView: FC = memo(() => {

  return (
    <AppContainer>
      <LoaderContainer>
        <One />
        <Two />
        <Three />
      </LoaderContainer>
    </AppContainer>
  );
});