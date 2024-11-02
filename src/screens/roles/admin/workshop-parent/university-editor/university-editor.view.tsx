
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { Input } from '../../../../../ui-kit/input';
import { UniversityEditorState } from '../../../../../store/reducers/roles/admin/university-editor-slice';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Textarea } from '../../../../../ui-kit/textarea';
import { Button } from '../../../../../ui-kit/button';
import { Row } from '../../../../../ui-kit/row';
import { Surface } from '../../../../../ui-kit/surface';
import { Column } from '../../../../../ui-kit/column';

export type UniversityEditorViewProps = {
  goToWorkshop: () => void;
  onSave: () => void;
  adminUniversityEditorState: UniversityEditorState;
  setNameUniversity: (value: string) => void;
  setDescriptionUniversity: (value: string) => void;
};

export const UniversityEditorView: FC<UniversityEditorViewProps> = memo(({
  goToWorkshop,
  adminUniversityEditorState,
  setDescriptionUniversity,
  setNameUniversity,
  onSave
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<UniversityEditorMobileView
        setNameUniversity={setNameUniversity}
        setDescriptionUniversity={setDescriptionUniversity}
        adminUniversityEditorState={adminUniversityEditorState}
        goToWorkshop={goToWorkshop}
        onSave={onSave}
        />) :
      (<UniversityEditorDesktopView
        setNameUniversity={setNameUniversity}
        onSave={onSave}
        setDescriptionUniversity={setDescriptionUniversity}
        adminUniversityEditorState={adminUniversityEditorState}
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const UniversityEditorMobileView: FC<UniversityEditorViewProps> = memo(({
  goToWorkshop,
  adminUniversityEditorState,
  setNameUniversity,
  setDescriptionUniversity,
  onSave
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_ADMIN' header='Университет'>
      <Input 
          header='Название' 
          placeholder='Белоруccкий....' error={adminUniversityEditorState.errors['universityNameError']}
          value={adminUniversityEditorState.nameUniversity} setValue={setNameUniversity}/>
      <Spacing themeSpace={30} variant='Column' />
      <Textarea
        value={adminUniversityEditorState.descriptionUniversity} 
        placeholder='Создан в ...' 
        height={200} setValue={setDescriptionUniversity}
        error={adminUniversityEditorState.errors['descriptionUniversityError']}
        header='Описание' />
      <Spacing themeSpace={40} variant='Column' />
      <Row>
        <Button onClick={() => {}} state={adminUniversityEditorState.loading} variant='recomended' padding={[12,17]}>
          Сохранить
        </Button>
        <Spacing variant='Row' themeSpace={20}/>
        <Button onClick={goToWorkshop} state={'idle'} variant='secondary' padding={[12,17]}>
          Отмена
        </Button>
      </Row>
    </WrapperMobile>
  );
});

export const UniversityEditorDesktopView: FC<UniversityEditorViewProps> = memo(({
  goToWorkshop,
  adminUniversityEditorState,
  setNameUniversity,
  setDescriptionUniversity,
  onSave
}) => {

  return (
    <WrapperDesktop isCenter={true} onBack={goToWorkshop} role='ROLE_ADMIN' header='Университет'>
      <Surface style={{width: 'auto'}} padding='40px'>
        <Column style={{width: 440}} horizontalAlign='center'>
          <Input 
              header='Название' 
              placeholder='Белоруccкий....' error={adminUniversityEditorState.errors['universityNameError']}
              value={adminUniversityEditorState.nameUniversity} setValue={setNameUniversity}/>
          <Spacing themeSpace={30} variant='Column' />
          <Textarea
            value={adminUniversityEditorState.descriptionUniversity} 
            placeholder='Создан в ...' 
            height={200} setValue={setDescriptionUniversity}
            error={adminUniversityEditorState.errors['descriptionUniversityError']}
            header='Описание' />
          <Spacing themeSpace={40} variant='Column' />
          <Row>
            <Button onClick={() => {}} state={adminUniversityEditorState.loading} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={goToWorkshop} state={'idle'} variant='secondary' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Surface>
    </WrapperDesktop>
  );
});