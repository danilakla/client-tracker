import { FC, memo, ReactNode } from "react";
import { Text } from "../text";
import { theme } from "../themes/theme";
import { Popup } from "../popup";
import { Column } from "../column";
import { Spacing } from "../spacing";
import { Button } from "../button";

export type ErrorPopupProps = {
    isOpen: boolean;
    closePopup: () => void;
    textError: ReactNode;
};

export const ErrorPopup: FC<ErrorPopupProps> = memo(({
    isOpen,
    closePopup,
    textError
}) => {

    return (<Popup isActive={isOpen} closePopup={closePopup}>
      <Column horizontalAlign='center' style={{width: 'auto'}}>
        <Text align='center' themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}> 
          {textError}
        </Text>
        <Spacing variant='Column' themeSpace={25} />
        <Button onClick={closePopup} variant='attentive' padding={[12, 17]}>
          Вернуться назад
        </Button>
      </Column>
    </Popup>)
})

