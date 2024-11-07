
import { FC, memo, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { Column } from '../../../../../ui-kit/column';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { Popup } from '../../../../../ui-kit/popup';
import { Text } from '../../../../../ui-kit/text';
import { Input } from '../../../../../ui-kit/input';
import { Surface } from '../../../../../ui-kit/surface';
import { Modal } from '../../../../../ui-kit/modal';

export type ClassFormatsViewProps = {
  goToWorkshop: () => void;
};

export const ClassFormatsView: FC<ClassFormatsViewProps> = memo(({
  goToWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);

  const openEditor = useCallback(()=>{
    setIsOpenEditor(true);
  },[])

  const onCancelDelete = useCallback(()=>{
    setIsOpenConfirmDelete(false);
  },[])

  const onCancelAdd = useCallback(()=>{
    setIsOpenConfirmDelete(false);
  },[])

  const onCancelEdit = useCallback(()=>{
    setIsOpenConfirmDelete(false);
  },[])

  const openConfirmDelete = useCallback(()=>{
    setIsOpenConfirmDelete(true);
  },[])

  return (
    isMobile ? 
      (<ClassFormatsMobileView
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        onCancelAdd={onCancelAdd}
        onCancelDelete={onCancelDelete}
        onCancelEdit={onCancelEdit}
        isOpenAdd={isOpenAdd}
        goToWorkshop={goToWorkshop}
        />) :
      (<ClassFormatsDesktopView
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        isOpenAdd={isOpenAdd}
        onCancelAdd={onCancelAdd}
        onCancelDelete={onCancelDelete}
        onCancelEdit={onCancelEdit}
        goToWorkshop={goToWorkshop}
        />)
  );
});

type LocalViewData = {
  isOpenEditor: boolean;
  isOpenConfirmDelete: boolean;
  goToWorkshop: () => void;
  isOpenAdd: boolean;
  onCancelDelete: () => void;
  onCancelAdd: () => void;
  onCancelEdit: () => void;
}

export const ClassFormatsMobileView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  isOpenAdd,
  onCancelAdd,
  onCancelDelete,
  onCancelEdit
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Форматы занятий'>
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={''} setValue={()=>{}}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button borderRaius={10} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' /> 
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <Modal isActive={isOpenAdd} closeModal={onCancelAdd}>
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Информационных....'
            value={'sadas'} setValue={() => {}}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={onCancelAdd} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>
      <Modal themeColor={theme.colors.surface} isActive={isOpenEditor} closeModal={onCancelEdit}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2}  align='center'> 
            Редактирование формата занятия
          </Text>
          <Spacing variant='Column' themeSpace={35}/>
          <Input 
            header='Изменить название' 
            placeholder='Информационных....'
            value={'sadas'} setValue={() => {}}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={onCancelEdit} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
          <Spacing variant='Column' themeSpace={35}/>
          <Button style={{width: '100%', maxWidth: 440}} borderRaius={10} onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Modal>
      <Popup isActive={isOpenConfirmDelete} closePopup={onCancelDelete}>
        <Column horizontalAlign='center'>
          <Text themeColor={theme.colors.attentive} themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, <br/>
            что хотите удалить?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
              Удалить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={onCancelDelete} variant='recomended' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
    </WrapperMobile>
  );
});

export const ClassFormatsDesktopView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  onCancelAdd,
  isOpenAdd,
  onCancelDelete,
  onCancelEdit
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Форматы занятий'>
      <Column horizontalAlign='center' style={{width: 695}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} value={''} setValue={()=>{}}/>
          <Spacing themeSpace={20} variant='Row' />
          <Button borderRaius={10} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
        </GridContainer>
      </Column>
      <Popup isActive={false} closePopup={onCancelAdd}>
        <Column horizontalAlign='center'>
          <Input 
            width={340}
            header='Введите название' 
            placeholder='Информационных....'
            value={'sadas'} setValue={() => {}}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={onCancelAdd} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup themeColor={theme.colors.secondary} isActive={isOpenEditor} closePopup={onCancelEdit} padding='35px'>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2}  align='center'> 
            Редактирование формата занятия
          </Text>
          <Spacing variant='Column' themeSpace={20}/>
          <Surface borderColor={theme.colors.foreground}>
            <Column horizontalAlign='center'>
              <Input 
                header='Изменить название' 
                placeholder='Информационных....'
                value={'sadas'} setValue={() => {}}/>
              <Spacing  themeSpace={25} variant='Column' />
              <Row>
                <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
                  Сохранить
                </Button>
                <Spacing variant='Row' themeSpace={20}/>
                <Button onClick={onCancelEdit} variant='attentive' padding={[12,17]}>
                  Отмена
                </Button>
              </Row>
            </Column>
          </Surface>
          <Spacing variant='Column' themeSpace={30}/>
          <Button borderRaius={10} width={340} onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Popup>
      <Popup isActive={isOpenConfirmDelete} closePopup={onCancelDelete}>
        <Column horizontalAlign='center'>
          <Text themeColor={theme.colors.attentive} themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, <br/>
            что хотите удалить?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
              Удалить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={onCancelDelete} variant='recomended' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});