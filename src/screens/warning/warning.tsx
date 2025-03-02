import { FC, memo, useEffect } from 'react';
import { WarningProps } from './warning.props';
import { WarningView } from './warning.view';
import { useTypedSelector } from '../../hooks/use-typed-selector';
import { useNavigate } from 'react-router-dom';

export const Warning: FC<WarningProps> = memo(() => {
  
  const { status } = useTypedSelector(state => state.appStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if(status !== 'app-error')
      navigate('/');
  },[navigate, status])

  return (
      <WarningView 
        />
    );
});
