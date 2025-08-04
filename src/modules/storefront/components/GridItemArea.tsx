/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties } from "react";

import _ from "lodash";
import { CardTypesEnum, FitImage, GridItemAreaData, MainModuleThemeInterface, ModulesType } from "../interfaces/Theme";
import { useDynamicApi } from "../provider/DynamicApiProvider";
import { useMobilePreferenceDataWhenMobile } from "../hooks/useMergeMobileData";
import { useRouterConnect } from "../../shared/hooks/useRouterConnect";
import { StorefrontMenu } from "./StorefrontMenu";
import { Banner } from "./Banner";
import { Products } from "./Products";
import { Accordions } from "./Accordions";
import { ImagePlusText } from "./ImagePlusText";
import { Paragraph } from "./Paragraph";
import { Midia } from "./Midia";
import { ContentCard } from "./ContentCard";
import { StorefrontButton } from "./StorefrontButton";
import { changeDynamicJsonToInsertIndex } from "../utils/jsonTransformation";
import { convertSpacingToCSS } from "../../shared/utils/convertSpacingToCSS";


export const GridItemArea = ({ data }: { data: GridItemAreaData }) => {
  const { styleData, mobileStyleData, id } = data;
  const { datasource } = useDynamicApi();
  const mergedStyleData = useMobilePreferenceDataWhenMobile(
    styleData,
    mobileStyleData
  );

  const {
    backgroundColor,
    container,
    gridColumns,
    gridRows,
    Items,
    columnSizes,
    margin,
    padding,
    rowSizes,
    dynamicGridPath,
    dynamicGrid,
    dynamicMaxItens,
    gapX,
    gapY,
    title,
    titleColor,
    titleSize,
    titleWeight,
    showHeight,
    titlePadding,
  } = mergedStyleData;

  const letters = "abcdefghijklmnopqrst";
  const { pushConnect } = useRouterConnect();
  const getTemplateAreas = () => {
    const filledArrays = Array(parseInt(gridRows ?? "2"))
      .fill("")
      .map(() => Array(parseInt(gridColumns ?? "4")).fill("x"));
    Items?.forEach((it, index) => {
      it.quadrants?.forEach((q) => {
        const divisor = Math.floor(q / parseInt(gridColumns ?? "4"));
        const nextNumber =
          divisor == 0 ? q : q - divisor * parseInt(gridColumns ?? "4");
        if (parseInt(gridRows ?? "2") >= divisor + 1) {
          filledArrays[divisor][Math.ceil(nextNumber)] = `x${index}`;
        }
      });
    });
    const arrayThreat = filledArrays.map((arr, index) =>
      arr.map((ar, ind) => {
        if (ar == "x") {
          return letters.at(ind + (index + 1) * parseInt(gridColumns ?? "4"));
        } else {
          return ar;
        }
      })
    );

    const map = arrayThreat.map((arr) => `"${arr.join(" ")}"`);
    return map.join(" ");
  };

  const getGridColumnSize = () => {
    if (columnSizes) {
      return columnSizes
        .split(",")
        .map((size) => (size && size != "0" ? size + "px" : "1fr"))
        .filter((_, index) => index + 1 <= parseInt(gridColumns ?? "4"))
        .join(" ");
    } else {
      return `repeat(${gridColumns ?? 4}, 1fr)`;
    }
  };

  const getGridRowSize = () => {
    if (rowSizes) {
      return rowSizes
        .split(",")
        .map((size) => (size && size != "0" ? size + "px" : "1fr"))
        .filter((_, index) => index + 1 <= parseInt(gridRows ?? "2"))
        .join(" ");
    } else {
      return `repeat(${gridRows ?? 2}, 1fr)`;
    }
  };

  const getImageFit = (fit: FitImage) => {
    if (fit == FitImage.CONTAIN) {
      return "contain";
    } else if (fit == FitImage.FILL) {
      return "fill";
    } else {
      return "cover";
    }
  };

  const ModuleToRenderer = (module: MainModuleThemeInterface) => {
    switch (module.type) {
      case ModulesType.CATEGORIES:
        return <StorefrontMenu data={{ ...module } as any} />;
      case ModulesType.BANNER:
        return <Banner data={{ ...module } as any} />;
      case ModulesType.CARDS:
        return <Products data={{ ...module } as any} />;
      case ModulesType.ACCORDIONS:
        return <Accordions data={{ ...module } as any} />;
      case ModulesType.IMAGE_PLUS_TEXT:
        return <ImagePlusText data={{ ...module } as any} />;
      case ModulesType.PARAGRAPH:
        return <Paragraph data={{ ...module } as any} />;
      case ModulesType.GRID_ITEM_AREA:
        return <GridItemArea data={{ ...module } as any} />;
      case ModulesType.MIDIA:
        return <Midia data={{ ...module } as any} />;
      case ModulesType.CONTENT_CARD:
        return (
          <ContentCard
            config={{ ...module.styleData } as any}
            product={{ ...module.contentData } as any}
            cardType={CardTypesEnum.CONTENT}
          />
        );
      case ModulesType.BUTTON:
        return <StorefrontButton data={{ ...module } as any} />;
      default:
        break;
    }
  };

  const dynamicGridRenderer = () => {
    const itemsToRender = _.get(datasource, dynamicGridPath, []).slice(
      0,
      dynamicMaxItens ?? 10
    ) as any[];

    return itemsToRender.map((_, index) => {
      return (
        <>
          {ModuleToRenderer(
            changeDynamicJsonToInsertIndex(Items![0].module, index)
          )}
        </>
      );
    });
  };

  return (
    <div
      id={`sf-${id}`}
      style={{
        backgroundColor,
      }}
    >
      <div
        className={`${
          container == "fullWidth" ? "pw-w-full" : "pw-container"
        } pw-mx-auto`}
      >
        {title && (
          <p
            style={{
              fontSize: titleSize ?? "15px",
              fontWeight: titleWeight ?? "600",
              color: titleColor ?? "black",
              padding: convertSpacingToCSS(titlePadding),
            }}
          >
            {title}
          </p>
        )}
        <div
          style={
            {
              margin: convertSpacingToCSS(margin),
              padding: convertSpacingToCSS(padding),
              gridTemplateColumns: getGridColumnSize(),
              gridTemplateRows: getGridRowSize(),
              "--template-areas": `${getTemplateAreas()}`,
              rowGap: gapX ?? "0" + "px",
              columnGap: gapY ?? "0" + "px",
            } as CSSProperties
          }
          className="pw-w-full pw-grid grid-areas"
        >
          {dynamicGrid && dynamicGridPath
            ? dynamicGridRenderer()
            : Items?.map((ite, index) =>
                ite.quadrants?.some(
                  (quad) =>
                    quad + 1 >
                    parseInt(gridRows ?? "2") * parseInt(gridColumns ?? "4")
                ) ? null : ite.module ? (
                  <div
                    className={`${
                      showHeight && "pw-min-h-[calc(100vh-150px)]"
                    }`}
                  >
                    {ModuleToRenderer(ite.module)}
                  </div>
                ) : (
                  <div
                    className="pw-bg-orange"
                    style={{ gridArea: "x" + index, zIndex: index }}
                    key={index}
                  >
                    <img
                      onClick={() =>
                        ite.link
                          ? ite.target == "_blank"
                            ? window.open(ite.link)
                            : pushConnect(ite.link)
                          : ""
                      }
                      style={{
                        objectFit: getImageFit(ite.fit ?? FitImage.COVER),
                      }}
                      className="pw-w-full pw-h-full pw-cursor-pointer"
                      src="https://picsum.photos/400/500"
                      alt=""
                    />
                  </div>
                )
              )}
        </div>
      </div>
    </div>
  );
};
