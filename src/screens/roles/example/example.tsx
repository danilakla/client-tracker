import { FC, memo } from 'react';
import { ExampleProps } from './example.props';
import { ExampleView } from './example.view';

export const Example: FC<ExampleProps> = memo(() => {
  

  return (
      <ExampleView 
        />
    );
});
