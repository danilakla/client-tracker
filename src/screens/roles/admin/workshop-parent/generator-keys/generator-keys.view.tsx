
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { Textarea } from '../../../../../ui-kit/textarea';
import { Select } from '../../../../../ui-kit/select';
import { GeneratorKeysState } from '../../../../../store/reducers/roles/admin/generator-keys-slice';
import { ItemOfSelectType } from '../../../../../ui-kit/select/select';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Button } from '../../../../../ui-kit/button';
import { Surface } from '../../../../../ui-kit/surface';
import { Column } from '../../../../../ui-kit/column';
import { Input } from '../../../../../ui-kit/input';

const data = [
  {
    name: 'Преподаватель',
    value: 'TEACHER',
  },
  {
    name: 'Декан',
    value: 'DEAN',
  }
]

export type GeneratorKeysViewProps = {
  goToWorkshop: () => void;
  onCreate: () => void;
  setRole: (role: ItemOfSelectType) => void;
  setFacultyName: (value: string) => void;
  adminGeneratorKeysState: GeneratorKeysState;
};

export const GeneratorKeysView: FC<GeneratorKeysViewProps> = memo(({
  goToWorkshop,
  onCreate,
  adminGeneratorKeysState,
  setRole,
  setFacultyName
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<GeneratorKeysMobileView
        setRole={setRole}
        onCreate={onCreate}
        setFacultyName={setFacultyName}
        adminGeneratorKeysState={adminGeneratorKeysState}
        goToWorkshop={goToWorkshop}
        />) :
      (<GeneratorKeysDesktopView
        setRole={setRole}
        setFacultyName={setFacultyName}
        onCreate={onCreate}
        adminGeneratorKeysState={adminGeneratorKeysState}
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const GeneratorKeysMobileView: FC<GeneratorKeysViewProps> = memo(({
  goToWorkshop,
  adminGeneratorKeysState,
  onCreate,
  setRole,
  setFacultyName
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_ADMIN' header='Генеарация ключей'>
      <Select header='Выберите роль' setValue={setRole} items={data} selectedItem={adminGeneratorKeysState.role} />
      <Spacing variant='Column' themeSpace={30} />
      {adminGeneratorKeysState.role.value === 'DEAN' && <>
        <Input 
          header='Введите название факультета' 
          placeholder='Информационных....' error={adminGeneratorKeysState.errors['facultyNameError']}
          value={adminGeneratorKeysState.facultyName} setValue={setFacultyName}/>
        <Spacing variant='Column' themeSpace={30} />
      </>}
      <Textarea 
        isCopy={true} 
        value={adminGeneratorKeysState.generatedKey} 
        placeholder='Создайте ключ' 
        disabled={true} header='Ключ' />
      <Spacing variant='Column' themeSpace={40} />
      <Button onClick={onCreate} state={adminGeneratorKeysState.loading} variant='primary' padding={[12,17]}>
        Создать ключ
      </Button>
    </WrapperMobile>
  );
});

export const GeneratorKeysDesktopView: FC<GeneratorKeysViewProps> = memo(({
  goToWorkshop,
  adminGeneratorKeysState,
  setRole,
  onCreate,
  setFacultyName
}) => {

  return (
    <WrapperDesktop isCenter={true} onBack={goToWorkshop} role='ROLE_ADMIN' header='Генеарация ключей'>
      <Surface padding='40px' style={{width: 'auto'}}>
        <Column style={{width: 440}} horizontalAlign='center'>
          <Select header='Выберите роль' setValue={setRole} items={data} selectedItem={adminGeneratorKeysState.role} />
          <Spacing variant='Column' themeSpace={30} />
          {adminGeneratorKeysState.role.value === 'DEAN' && <>
            <Input 
              header='Введите название факультета' 
              placeholder='Информационных....' error={adminGeneratorKeysState.errors['facultyNameError']}
            value={adminGeneratorKeysState.facultyName} setValue={setFacultyName}/>
            <Spacing variant='Column' themeSpace={30} />
          </>}
          <Textarea isCopy={true} value={adminGeneratorKeysState.generatedKey} placeholder='Создайте ключ' disabled={true} header='Ключ' />
          <Spacing variant='Column' themeSpace={40} />
          <Button onClick={onCreate} state={adminGeneratorKeysState.loading} variant='primary' padding={[12,17]}>
            Создать ключ
          </Button>
        </Column>
      </Surface>
    </WrapperDesktop>
  );
});