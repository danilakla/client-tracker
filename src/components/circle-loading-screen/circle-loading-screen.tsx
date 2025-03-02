import { FC, memo, ReactNode, useState } from "react";
import { CircleLoading } from "../../ui-kit/circle-loading";
import { Column } from "../../ui-kit/column";

export type CircleLoadingScreenProps = {
};

export const CircleLoadingScreen: FC<CircleLoadingScreenProps> = memo(() => {

  return(
    <Column style={{position: 'absolute', height: window.innerHeight, top: 0}}>
	  <CircleLoading state={'loading'}/>
	</Column>
)})
