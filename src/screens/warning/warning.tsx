import { FC, memo } from 'react';
import { WarningProps } from './warning.props';
import { WarningView } from './warning.view';

export const Warning: FC<WarningProps> = memo(() => {
  

  return (
      <WarningView 
        />
    );
});
