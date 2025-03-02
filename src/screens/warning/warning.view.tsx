
import { FC, memo } from 'react';
import { theme } from '../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../components/wrapper-mobile';
import { WrapperDesktop } from '../../components/wrapper-desktop';
import { Button } from '../../ui-kit/button';
import { Column } from '../../ui-kit/column';
import { Spacing } from '../../ui-kit/spacing';
import smthWrongIcon from '../../images/server-error.png';
import { Image } from '../../ui-kit/image';
import { Text } from '../../ui-kit/text';

export type WarningViewProps = {

};

export const WarningView: FC<WarningViewProps> = memo(() => {
  return (
    <Column style={{height: '100vh'}} horizontalAlign='center' verticalAlign='center'>
      <Image src={smthWrongIcon} style={{marginLeft: 60}} width={250} height={250} />
      <Spacing variant='Column' themeSpace={15} />
      <Text themeFont={theme.fonts.h1} themeColor={theme.colors.gray}>
        Упс, кажется, что-то пошло не так
      </Text>
      <Spacing variant='Column' themeSpace={30} />
      <Button 
        onClick={() => window.location.reload()} 
        variant='primary' padding={[12,17]}>
        Перезагрузить
      </Button>
    </Column>
  );
});