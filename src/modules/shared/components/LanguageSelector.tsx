/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo, useRef, useState } from "react";
import { useClickAway, useLocalStorage } from "react-use";

import ArrowDown from "../assets/icons/arrowDown.svg";

import useTranslation from "../hooks/useTranslation";

import { useRouterConnect } from "../hooks/useRouterConnect";
import { ThemeContext } from "../../storefront/contexts/ThemeContext";

const baseUrl =
  "https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/";

export const CountryFlag = ({
  code,
  width = 24,
  height = 24,
}: {
  code: string;
  width?: number;
  height?: number;
}) => {
  const lowerCode = code?.toLowerCase();
  const fileCode = useMemo(() => {
    if (lowerCode.includes("pt")) return "br";
    else if (lowerCode.includes("en") || lowerCode.includes("uk")) return "us";
    else if (lowerCode.includes("-")) return lowerCode.split("-")[1];
    else return lowerCode;
  }, [lowerCode]);

  const flagUrl = `${baseUrl}${fileCode}.svg`;

  return useMemo(
    () => (
      <img
        src={flagUrl}
        alt={`Flag of ${code}`}
        width={width}
        height={height}
      />
    ),
    [code, flagUrl, height, width]
  );
};

const Menu = ({
  languages,
  backgroundColor,
  textColor,
  fontFamily,
  handleLang,
  setMenu,
}: {
  languages: any;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  handleLang(lang: string): void;
  setMenu(val: boolean): void;
}) => {
  return (
    <div className="pw-relative">
      <div
        style={{ backgroundColor, color: textColor }}
        className={`pw-absolute pw-mt-[1.68rem] pw-bg-white pw-w-[160px] pw-rounded-b-[20px] pw-z-30 pw-px-2 pw-py-3 pw-shadow-md`}
      >
        <div className="pw-mt-[10px]">
          {languages.map((lang: { value: string; label: string }) => {
            return (
              <button
                onClick={() => {
                  handleLang(lang?.value);
                  setMenu(false);
                }}
                key={lang?.value}
                className="pw-flex pw-items-center pw-gap-x-2 pw-py-[8px] pw-cursor-pointer pw-stroke-[#383857] hover:pw-bg-opacity-30"
              >
                <CountryFlag code={lang?.value} height={30} width={30} />
                <p
                  className="pw-font-[400] pw-text-xs"
                  style={{
                    fontFamily:
                      (fontFamily ? fontFamily : "Poppins") + ", sans-serif",
                  }}
                >
                  {lang?.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const LanguageSelector = ({
  bgColor,
  textColor,
  fontFamily,
}: {
  bgColor: string;
  textColor: string;
  fontFamily: string;
}) => {
  const [, i18n] = useTranslation();
  const context = useContext(ThemeContext);
  const [userLocale, setUserLocale] = useLocalStorage("userLocale");
  const router = useRouterConnect();

  const languages = useMemo(() => {
    const lang =
      context?.defaultTheme?.configurations?.contentData?.i18nJson?.locales;
    if (lang?.length > 0) {
      const newArr = lang?.map((res: { label: any; code: any }) => {
        return { label: res?.label, value: res?.code };
      });
      return newArr;
    } else return [];
  }, [context?.defaultTheme?.configurations?.contentData?.i18nJson?.locales]);

  const handleLang = (lang: string) => {
    i18n?.changeLanguage(lang).then(() => {
      i18n.options.lng = lang;
    });
    setUserLocale(lang);
    router.reload();
  };

  const [menu, setMenu] = useState<boolean>(false);
  const ref = useRef(null);

  useClickAway(ref, () => {
    if (menu) setMenu(false);
  });

  return (
    <>
      <div className="pw-py-[0.27rem] pw-mr-1" ref={ref}>
        <div onClick={() => setMenu(!menu)} className="pw-cursor-pointer">
          <div
            onClick={() => setMenu(!menu)}
            className="pw-ml-5 pw-flex pw-items-center pw-gap-[6px] pw-cursor-pointer"
          >
            <CountryFlag
              code={(userLocale as string) || i18n.language}
              height={30}
              width={30}
            />
            <ArrowDown
              style={{
                stroke: textColor,
                transform: menu ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </div>

        {menu && (
          <Menu
            textColor={textColor}
            backgroundColor={bgColor}
            languages={languages}
            fontFamily={fontFamily}
            handleLang={handleLang}
            setMenu={setMenu}
          />
        )}
      </div>
    </>
  );
};
