import { CSSProperties } from 'react';

import { ReactComponent as ArrowDownIcon } from '../../shared/assets/icons/chevronDownOutlined.svg';
import { AccordionsData, SpecificContentAccordion } from '../interfaces';
import './Accordions.css';

export const Accordions = ({ data }: { data: AccordionsData }) => {
  const { styleData, contentData } = data;

  return (
    <div className="pw-flex pw-flex-col pw-gap-8 pw-px-2 sm:pw-px-0">
      {contentData?.accordionsItems?.map((itemData) => (
        <div key={itemData.title} className="pw-w-full">
          <Accordion styleData={styleData} contentData={itemData} />
        </div>
      ))}
    </div>
  );
};

interface AccordionProps {
  styleData: AccordionsData['styleData'];
  contentData: SpecificContentAccordion;
}

const Accordion = ({ styleData, contentData }: AccordionProps) => {
  const {
    titleAndArrowColor,
    titleAndArrowHoverColor,
    contentColor,
    backgroundColor,
  } = styleData;

  return (
    <details
      className="pw-box-border pw-min-h-20 pw-shadow-[0_4px_11px_rgba(0,0,0,0.15)] pw-rounded-2xl pw-px-8 pw-py-[22px] pw-container pw-mx-auto"
      style={
        {
          background: backgroundColor,
        } as CSSProperties
      }
    >
      <summary
        className="accordions-title pw-cursor-pointer pw-font-roboto pw-font-bold pw-text-2xl pw-list-none pw-flex pw-justify-between pw-items-center"
        style={
          {
            '--accordions-title-color': titleAndArrowColor,
            '--accordions-title-hover-color': titleAndArrowHoverColor,
          } as CSSProperties
        }
      >
        {contentData.title}
        <div
          style={
            {
              '--accordions-arrow-color': titleAndArrowColor,
              '--accordions-arrow-hover-color': titleAndArrowHoverColor,
              '--accordions-arrow-selected-bg-color': titleAndArrowColor,
            } as CSSProperties
          }
          className="accordions-arrow pw-shadow-[0_4px_11px_rgba(0,0,0,0.15)] pw-min-w-[40px] pw-min-h-[40px] pw-grid pw-place-items-center pw-rounded-3xl"
        >
          <ArrowDownIcon />
        </div>
      </summary>

      <p
        className="pw-font-poppins pw-text-[15px] pw-leading-[22.5px]"
        style={{ color: contentColor }}
      >
        {contentData.content}
      </p>
    </details>
  );
};
