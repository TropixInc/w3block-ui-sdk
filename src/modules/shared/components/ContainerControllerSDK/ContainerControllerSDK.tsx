import { JSX, ReactNode, lazy } from "react";

import { ExtraBy, PoweredBy } from "../PoweredBy";
import { position } from "../../enums/styleConfigs";
import { ContentTypeEnum } from "../../../poll/enums/contentType";
import { FAQContextEnum } from "../../enums/FAQContext";
import { ContainerTextBesideProps } from "../ContainerTextBeside";
import { ContainerCenter } from "./ContainerCenter";
import { ContainerBeside } from "./ContainerBeside";

interface ContainerControllerProps {
  bgColor?: string;
  infoPosition?: position;
  contentType?: ContentTypeEnum;
  infoComponent?: ReactNode | JSX.Element;
  className?: string;
  FAQContext?: FAQContextEnum;
  classes?: ContainerControllerClasses;
  logoUrl?: string;
  separation?: boolean;
  textContainer?: ContainerTextBesideProps;
  fullScreen?: boolean;
  extraBy?: ExtraBy[];
}

export interface ContainerControllerClasses {
  infoComponentClass?: string;
  besideInfoClass?: string;
}

export const ContainerControllerSDK = ({
  bgColor = "rgb(255,255,255)",
  infoPosition = position.CENTER,
  contentType = ContentTypeEnum.FAQ,
  FAQContext = FAQContextEnum.POST_SALE,
  infoComponent,
  classes,
  className = "",
  logoUrl,
  separation,
  textContainer,
  fullScreen = true,
  extraBy,
}: ContainerControllerProps) => {
  const positionClass =
    infoPosition === position.CENTER
      ? "pw-justify-center"
      : infoPosition === position.RIGHT
      ? "justify-right"
      : "justify-left";

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={` ${
        fullScreen ? "pw-w-screen pw-min-h-screen pw-pt-10" : ""
      } pw-flex pw-px-4 pw-flex-col pw-justify-center pw-items-center ${className}`}
    >
      <div
        className={`pw-container pw-mx-auto pw-w-full pw-flex pw-items-center pw-flex-1 ${positionClass}`}
      >
        {infoPosition === position.CENTER ? (
          <ContainerCenter
            className={classes?.infoComponentClass}
            infoComponent={infoComponent}
            logoUrl={logoUrl}
          />
        ) : (
          <ContainerBeside
            textContainer={textContainer}
            separation={separation}
            classes={classes}
            infoPosition={infoPosition}
            infoComponent={infoComponent}
            contentType={contentType}
            FAQContext={FAQContext}
            logoUrl={logoUrl}
          />
        )}
      </div>
      <PoweredBy
        classes={{ title: "pw-text-white" }}
        logoColor="white"
        PwPosition={position.RIGHT}
        extraBy={extraBy}
      />
    </div>
  );
};
