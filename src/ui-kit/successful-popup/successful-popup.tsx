import { FC, memo, ReactNode } from "react";
import { Text } from "../text";
import { theme } from "../themes/theme";
import { Popup } from "../popup";
import { Column } from "../column";
import { Spacing } from "../spacing";
import { Button } from "../button";
import successSVG from '../../images/success.svg';
import { Image } from "../image";

export type SuccessfulPopupProps = {
    isOpen: boolean;
    closePopup: () => void;
    text: ReactNode;
};

export const SuccessfulPopup: FC<SuccessfulPopupProps> = memo(({
    isOpen,
    closePopup,
    text
}) => {

    return ( <Popup isActive={isOpen} closePopup={closePopup}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2} themeColor={theme.colors.success}> 
          {text}
        </Text>
        <Spacing variant='Column' themeSpace={20} />
        <Image src={successSVG} width={150} height={150}/> 
        <Spacing variant='Column' themeSpace={25} />
        <Button onClick={closePopup} borderRaius={10} variant='recomended' padding={[12, 17]}>
          Вернуться назад
        </Button>
      </Column>
    </Popup>)
})

