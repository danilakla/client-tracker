
import { FC, memo, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Button } from '../../../../../ui-kit/button';

import * as XLSX from 'xlsx';
import { Surface } from '../../../../../ui-kit/surface';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Search } from '../../../../../ui-kit/search';
import { Text } from '../../../../../ui-kit/text';
import { Column } from '../../../../../ui-kit/column';
import { Row } from '../../../../../ui-kit/row';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { GenerateStudentsState, Student } from '../../../../../store/reducers/roles/dean/generate-students-slice';
import { Popup } from '../../../../../ui-kit/popup';
import { Image } from '../../../../../ui-kit/image';

import successSVG from '../../../../../images/success.svg';

export type ExcelData = {
  [key: string]: string | number;
}

export type GenerateStudentsViewProps = {
  goToWorkshop: () => void;
  filteredStudents: Student[];
  deanGenerateStudentsState: GenerateStudentsState;
  onCreateAccounts: (onSuccess?: () => void, onError?: () => void) => void;
  clearData: () => void;
  setSearchText: (value: string) => void;
  setStudents: (value: Student[]) => void;
};

export const GenerateStudentsView: FC<GenerateStudentsViewProps> = memo(({
  goToWorkshop,
  onCreateAccounts,
  filteredStudents,
  deanGenerateStudentsState,
  clearData,
  setSearchText,
  setStudents
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const binaryStr = new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        );
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: ["name", "lastname", "surname", "numberOfGroup", "specialty"]
        }) as Student[];
        
        setStudents(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [setStudents]);


  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  },[]);

  const onClear = useCallback(() => {
    clearData();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  },[clearData]);

  const [isSuccessPopup, setIsSuccessPopup] = useState<boolean>(false);
  const [isErrorPopup, setIsErrorPopup] = useState<boolean>(false);

  const closeSuccessPopup = useCallback(() => {
    setIsSuccessPopup(false);
    clearData();
  },[clearData])

  const closeErrorPopup = useCallback(() => {
    setIsErrorPopup(false);
  },[])
  
  const onCreate = useCallback(() => {
    onCreateAccounts(
      () => setIsSuccessPopup(true), 
      () => setIsErrorPopup(true));
  },[onCreateAccounts]);

  return (
    isMobile ? 
      (<GenerateStudentsMobileView
        handleButtonClick={handleButtonClick}
        handleFileUpload={handleFileUpload}
        setSearchText={setSearchText}
        fileInputRef={fileInputRef}
        onCreate={onCreate}
        closeSuccessPopup={closeSuccessPopup}
        closeErrorPopup={closeErrorPopup}
        filteredStudents={filteredStudents}
        isSuccessPopup={isSuccessPopup}
        isErrorPopup={isErrorPopup}
        onClear={onClear}
        deanGenerateStudentsState={deanGenerateStudentsState}
        goToWorkshop={goToWorkshop}
        />) :
      (<GenerateStudentsDesktopView
        handleButtonClick={handleButtonClick}
        onCreate={onCreate}
        filteredStudents={filteredStudents}
        setSearchText={setSearchText}
        closeSuccessPopup={closeSuccessPopup}
        closeErrorPopup={closeErrorPopup}
        isSuccessPopup={isSuccessPopup}
        isErrorPopup={isErrorPopup}
        onClear={onClear}
        handleFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        deanGenerateStudentsState={deanGenerateStudentsState}
        goToWorkshop={goToWorkshop}
        />)
  );
});

type LocalViewData = {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
  onCreate: () => void;
  filteredStudents: Student[];
  setSearchText: (value: string) => void;
  deanGenerateStudentsState: GenerateStudentsState;
  onClear: () => void;
  goToWorkshop: () => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  closeSuccessPopup: () => void;
  closeErrorPopup: () => void;
  isSuccessPopup: boolean;
  isErrorPopup: boolean;
}

export const GenerateStudentsMobileView: FC<LocalViewData> = memo(({
  goToWorkshop,
  handleButtonClick,
  handleFileUpload,
  setSearchText,
  onCreate,
  onClear,
  deanGenerateStudentsState,
  fileInputRef,
  filteredStudents,
  closeSuccessPopup,
  closeErrorPopup,
  isSuccessPopup,
  isErrorPopup
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Генерация студентов'>
      <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      {deanGenerateStudentsState.students.length === 0 ? (<Column style={{
        position: 'absolute',
        top: 0,
        height: '100vh',
      }} horizontalAlign='center' verticalAlign='center'>
        <Button onClick={handleButtonClick} borderRaius={10} variant='primary' padding={[12, 17]}>
          Загрузить файл
        </Button>
      </Column>) : <Column horizontalAlign='center' style={{maxWidth: 440}}>
        <Column>
          <Button onClick={handleButtonClick} borderRaius={10} variant='primary' padding={[12, 17]}>
            Загрузить новый файл
          </Button>
          <Spacing variant='Column' themeSpace={15} />
          <Row>
            <Button 
              state={deanGenerateStudentsState.loading} 
              onClick={onCreate} borderRaius={10} 
              variant='recomended' padding={[12, 10]}>
              Создать аккаунты
            </Button>
            <Spacing variant='Row' themeSpace={15} />
            <Button onClick={onClear} borderRaius={10} variant='attentive' padding={[12, 10]}>
              Очистить
            </Button>
          </Row>
        </Column>
        <Spacing variant='Column' themeSpace={25} />
        <Search value={deanGenerateStudentsState.searchText} setValue={setSearchText}/>
        <Spacing variant='Column' themeSpace={25} />
        {filteredStudents.map((item) => <>
          <StudentView data={item}/>
          <Spacing variant='Column' themeSpace={10} />
        </>)}
      </Column>}
      <Popup isActive={isErrorPopup} closePopup={closeErrorPopup}>
        <Column horizontalAlign='center' style={{width: 290}}>
          <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}> 
            {deanGenerateStudentsState.errors['createError']}
          </Text>
          <Spacing variant='Column' themeSpace={25} />
          <Button onClick={closeErrorPopup} borderRaius={10} variant='attentive' padding={[12, 17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
      <Popup isActive={isSuccessPopup} closePopup={closeSuccessPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} themeColor={theme.colors.success}> 
            Операция прошла успешно
          </Text>
          <Spacing variant='Column' themeSpace={20} />
          <Image src={successSVG} width={150} height={150}/> 
          <Spacing variant='Column' themeSpace={25} />
          <Button onClick={closeSuccessPopup} borderRaius={10} variant='recomended' padding={[12, 17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
    </WrapperMobile>
  );
});

export const GenerateStudentsDesktopView: FC<LocalViewData> = memo(({
  goToWorkshop,
  handleButtonClick,
  handleFileUpload,
  setSearchText,
  deanGenerateStudentsState,
  onClear,
  onCreate,
  fileInputRef,
  closeSuccessPopup,
  closeErrorPopup,
  isSuccessPopup,
  isErrorPopup,
  filteredStudents
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Генерация студентов'>
      <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      {deanGenerateStudentsState.students.length === 0 ? (<Column style={{
        position: 'absolute',
        top: 0,
        height: '100vh',
      }} horizontalAlign='center' verticalAlign='center'>
        <Button onClick={handleButtonClick} borderRaius={10} variant='primary' padding={[12, 17]}>
          Загрузить файл
        </Button>
      </Column>) : (<Column style={{width: 905}}>
        <Row>
          <Button 
            onClick={onCreate} 
            state={deanGenerateStudentsState.loading} 
            borderRaius={10} variant='recomended' 
            padding={[12, 17]}>
            Создать аккаунты
          </Button>
          <Spacing variant='Row' themeSpace={20} />
          <Button onClick={handleButtonClick} borderRaius={10} variant='primary' padding={[12, 17]}>
            Загрузить новый файл
          </Button>
          <Spacing variant='Row' themeSpace={20} />
          <Button onClick={onClear} borderRaius={10} variant='attentive' padding={[12, 17]}>
            Очистить
          </Button>
        </Row>
        <Spacing variant='Column' themeSpace={25} />
        <Search isMobile={false} value={deanGenerateStudentsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={25} variant='Column' />
        <GridContainer columns={2}>
          {filteredStudents.map((item) => <StudentView data={item} isMobile={false}/>)}
        </GridContainer>
      </Column>)}
      <Popup isActive={isErrorPopup} closePopup={closeErrorPopup}>
        <Column horizontalAlign='center' style={{width: 290}}>
          <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}> 
            {deanGenerateStudentsState.errors['createError']}
          </Text>
          <Spacing variant='Column' themeSpace={25} />
          <Button onClick={closeErrorPopup} borderRaius={10} variant='attentive' padding={[12, 17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
      <Popup isActive={isSuccessPopup} closePopup={closeSuccessPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} themeColor={theme.colors.success}> 
            Операция прошла успешно
          </Text>
          <Spacing variant='Column' themeSpace={20} />
          <Image src={successSVG} width={150} height={150}/> 
          <Spacing variant='Column' themeSpace={25} />
          <Button onClick={closeSuccessPopup} borderRaius={10} variant='recomended' padding={[12, 17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});


type StudentViewProps = {
  isMobile?: boolean;
  data: Student;
}


export const StudentView: FC<StudentViewProps> = memo(({
  isMobile = true,
  data
}) => {

  return (
    <Surface style={isMobile ? undefined : {width: 440}}>
        <Text themeFont={theme.fonts.h2}> 
          {data.lastname}
        </Text>
        <Spacing themeSpace={10} variant='Column' />
        <Text themeFont={theme.fonts.h2}> 
          {data.name}
        </Text>
        <Spacing themeSpace={10} variant='Column' />
        <Text themeFont={theme.fonts.h2}> 
          {data.surname}
        </Text>
        <Spacing themeSpace={10} variant='Column' />
        <Text themeFont={theme.fonts.ht2}> 
          Группа - {data.numberOfGroup}
        </Text>
        <Spacing themeSpace={10} variant='Column' />
        <Text themeFont={theme.fonts.ht2}> 
          Специальность - {data.specialty}
        </Text>
      </Surface>
  );
});