import { FC, memo, ReactNode, useState } from "react";
import { Popup } from "../../ui-kit/popup";
import { Column } from "../../ui-kit/column";
import { Text } from "../../ui-kit/text";
import { Spacing } from "../../ui-kit/spacing";
import { Row } from "../../ui-kit/row";
import { Button } from "../../ui-kit/button";
import { theme } from "../../ui-kit/themes/theme";

export type ConfirmDeletePopupProps = {
	isActive: boolean; 
	cancelDelete: () => void;
	onDelete: () => void;
	state?: "loading" | "idle" | "success" | "error";
};

export const ConfirmDeletePopup: FC<ConfirmDeletePopupProps> = memo(({
	isActive,
	onDelete,
	cancelDelete,
	state
}) => {

  return(
    <Popup isActive={isActive} closePopup={cancelDelete}>
      <Column horizontalAlign='center'>
        <Text themeColor={theme.colors.attentive} themeFont={theme.fonts.h2} align='center'> 
          Вы уверены, <br/>
          что хотите удалить?
        </Text>
        <Spacing  themeSpace={25} variant='Column' />
        <Row>
          <Button onClick={onDelete} state={state} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
          <Spacing variant='Row' themeSpace={20}/>
          <Button onClick={cancelDelete} variant='recomended' padding={[12,17]}>
            Отмена
          </Button>
        </Row>
      </Column>
    </Popup>
)})
