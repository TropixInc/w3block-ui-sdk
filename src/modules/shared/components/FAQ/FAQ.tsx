import { PropsWithChildren, ReactChild, ReactNode, useState } from 'react';

interface Classes {
  container: string;
  title: string;
  subtitle: string;
  question: string;
  answer: string;
}

export interface FAQProps {
  classes?: Classes;
  title: string;
  subtitle: string;
  questions: ReactNode;
  answers: ReactNode;
}

interface AccordionProps {
  question: ReactChild;
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
        className={`pw-flex pw-flex-row pw-items-center pw-cursor-pointer ${classes?.question}`}
        onClick={() => setOpen(!open)}
      >
        <p className="pw-text-lg pw-font-sans pw-text-gray-500 pw-mx-2 pw-my-1 pw-w-3">
          {open ? '-' : '+'}
        </p>
        {question}
      </div>
      <div className={`pw-ml-7 ${classes?.answer}`}>{open && answer}</div>
    </>
  );
};

export const FAQ = ({
  classes,
  title,
  subtitle,
  questions,
  answers,
}: FAQProps) => {
  return (
    <div className={`pw-w-full pw-font-sans ${classes?.container}`}>
      <p className={`pw-text-3xl pw-font-bold pw-ml-7 ${classes?.title}`}>
        {title}
      </p>
      <p
        className={`pw-text-lg pw-font-bold pw-ml-7 pw-my-2 ${classes?.subtitle}`}
      >
        {subtitle}
      </p>
      {(Array.isArray(questions) ? questions : [questions]).map(
        (question, index) => (
          <Accordion question={question} key={index}>
            {(Array.isArray(answers) ? answers : [answers])[index]}
          </Accordion>
        )
      )}
    </div>
  );
};
