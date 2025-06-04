import { PropsWithChildren, useState } from 'react';

import classNames from 'classnames';


import { useTranslation } from 'react-i18next';
import { useFAQ } from '../hooks/useFAQ';
import { useLocale } from '../hooks/useLocale';


interface Classes {
  container?: string;
  title?: string;
  subtitle?: string;
  question?: string;
  answer?: string;
}

export interface FAQProps {
  classes?: Classes;
  page?: number;
  limit?: number;
  name?: string;
}

interface AccordionProps {
  question?: string;
  classes?: Pick<Classes, 'question' | 'answer'>;
}

const Accordion = ({
  question,
  children: answer,
  classes,
}: PropsWithChildren<AccordionProps>) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className={classNames(
          classes?.question,
          'pw-flex pw-flex-row pw-items-center pw-cursor-pointer pw-font-montserrat pw-text-sm pw-font-normal',
          open ? 'pw-text-[#353945]' : 'pw-text-[#777E8F]'
        )}
        onClick={() => setOpen(!open)}
      >
        <p
          className={classNames(
            'pw-text-lg pw-font-montserrat pw-mx-2 pw-my-1 pw-w-3',
            open ? 'pw-text-[#353945]' : 'pw-text-[#777E8F]'
          )}
        >
          {open ? '-' : '+'}
        </p>
        {question}
      </div>
      <div
        className={classNames(
          classes?.answer,
          'pw-ml-7 pw-font-montserrat pw-text-sm pw-font-normal pw-w-[398px] pw-text-[#777E8F]'
        )}
      >
        {open && answer}
      </div>
    </>
  );
};

export const FAQ = ({
  classes,
  page = 1,
  limit = 50,
  name = 'home',
}: FAQProps) => {
  const { data: FAQ } = useFAQ(page, limit, name);
  const locale = useLocale();
  const [translate] = useTranslation();

  return (
    <div className={classNames(classes?.container, 'pw-w-full')}>
      <p
        className={classNames(
          classes?.title,
          'pw-text-2xl pw-font-semibold pw-ml-7 pw-font-montserrat'
        )}
      >
        FAQ
      </p>
      <p
        className={classNames(
          classes?.subtitle,
          'pw-text-base pw-font-semibold pw-ml-7 pw-my-2 pw-font-montserrat'
        )}
      >
        {translate('components>FAQ>askedQuestions')}
      </p>
      {FAQ?.data.items.map((item: any) => (
        <Accordion
          question={
            locale === 'pt-BR'
              ? 'pt-br' in item.question
                ? item.question['pt-br']
                : item.question['en-us']
              : 'en-us' in item.question
              ? item.question['en-us']
              : item.question['pt-br']
          }
          key={
            locale === 'pt-BR'
              ? 'pt-br' in item.question
                ? item.question['pt-br']
                : item.question['en-us']
              : 'en-us' in item.question
              ? item.question['en-us']
              : item.question['pt-br']
          }
        >
          {locale === 'pt-BR'
            ? 'pt-br' in item.answer
              ? item.answer['pt-br']
              : item.answer['en-us']
            : 'en-us' in item.answer
            ? item.answer['en-us']
            : item.answer['pt-br']}
        </Accordion>
      ))}
    </div>
  );
};
