import classNames from "classnames";
import _ from "lodash";
import { AlignmentEnum, MidiaData } from "../interfaces/Theme";
import { useDynamicApi } from "../provider/DynamicApiProvider";
import { useMobilePreferenceDataWhenMobile } from "../hooks/useMergeMobileData";
import { convertSpacingToCSS } from "../../shared/utils/convertSpacingToCSS";
import { ImageSDK } from "../../shared/components/ImageSDK";
import { useEffect, useState } from "react";

const ratios: Record<string, string> = {
  default: "",
  "4:1": "pw-aspect-[4/1]",
  "3:1": "pw-aspect-[3/1]",
  "16:9": "pw-aspect-video",
  "20:9": "pw-aspect-[20/9]",
};

type AlignmentClassNameMap = Record<AlignmentEnum, string>;
const rowAlignments: AlignmentClassNameMap = {
  left: "pw-object-left",
  right: "pw-object-right",
  center: "pw-object-center",
};

interface MidiaProps {
  data: MidiaData;
  serverDeviceType?: 'mobile' | 'desktop';
}

export const Midia = ({ data, serverDeviceType = 'desktop' }: MidiaProps) => {
  const { datasource } = useDynamicApi();
  const { styleData, mobileStyleData, id } = data;

  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    mediaUrl,
    mediaUrlMobile,
    mediaLink,
    imageDisposition,
    imageRatio,
    imageAlignment,
    margin,
    padding,
    imageCompression,
  } = mergedStyleData;

  const layoutClass =
    imageDisposition === "fixed" ? "pw-container" : "pw-w-full";

  const rowAlignmentClass = rowAlignments[imageAlignment ?? AlignmentEnum.LEFT];

  const ratio = ratios[imageRatio ?? "default"];

  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Use server-provided device type initially, then let client handle it after hydration
  const bgUrl = (isHydrated ? (window.innerWidth <= 640) : (serverDeviceType === 'mobile')) && mediaUrlMobile 
    ? mediaUrlMobile 
    : mediaUrl;

  return (
    <div
      id={`sf-${id}`}
      className="pw-w-full"
      style={{
        margin: convertSpacingToCSS(margin),
        padding: convertSpacingToCSS(padding),
      }}
    >
      <div className={classNames(ratio, layoutClass, "pw-mx-auto")}>
        <a href={_.get(datasource, mediaLink, mediaLink)}>
          <ImageSDK
            className={classNames(
              ratio,
              rowAlignmentClass,
              "!pw-object-center pw-object-cover pw-w-full pw-h-full"
            )}
            src={_.get(datasource, bgUrl?.assetUrl, bgUrl?.assetUrl)}
            width={imageCompression === "no-compression" ? undefined : 1920}
            quality={imageCompression}
          />
        </a>
      </div>
    </div>
  );
};
