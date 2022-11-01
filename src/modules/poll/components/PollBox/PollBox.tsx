import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';

import { AuthTextController } from '../../../auth/components/AuthTextController';
import StarFilled from '../../../shared/assets/icons/starFilled.png';
import StarOutlined from '../../../shared/assets/icons/starOutlined.png';
import { Box } from '../../../shared/components/Box/Box';
import { WeblockButton } from '../../../shared/components/WeblockButton/WeblockButton';
import { PixwayAppRoutes } from '../../../shared/enums/PixwayAppRoutes';
import { usePixwaySession } from '../../../shared/hooks/usePixwaySession';
import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import { usePoll } from '../../hooks/usePoll';
import { usePollInviteTransfer } from '../../hooks/usePollInviteTransfer';
import { usePostAnswer } from '../../hooks/usePostAnswer';
import { IPollInterface } from './IPollInterface';

interface PollBoxProps {
  pollId?: string;
  redirectWithoutPoll?: string;
}

export const PollBox = ({
  pollId,
  redirectWithoutPoll = PixwayAppRoutes.SIGN_IN,
}: PollBoxProps) => {
  const router = useRouter();
  const [translate] = useTranslation();
  const { query, push, isReady } = useRouter();
  const { pollId: pollQuery } = query;
  const { data: session } = usePixwaySession();
  const [error, setError] = useState('');
  pollId = pollId ?? (pollQuery as string);

  const { data, isError } = usePoll(pollId ?? (pollQuery as string));
  const { mutate } = usePostAnswer();
  const { mutate: inviteUser } = usePollInviteTransfer();

  const schema = object().shape({
    email: string().email(),
  });

  useEffect(() => {
    if ((!pollId && isReady) || isError) {
      push(redirectWithoutPoll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId, isReady]);

  const methods = useForm<IPollInterface>({
    defaultValues: {
      email: session?.user.email ?? '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (session) methods.setValue('email', session?.user.email ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const [stars, setStars] = useState([false, false, false, false, false]);
  const [beforeHover, setBeforeHover] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const changeOnHover = (index: number) => {
    const newArr = stars.map((_, i) => (i <= index ? true : false));
    setStars([...newArr]);
  };

  const onMouseOut = () => {
    setStars([...beforeHover]);
  };

  const onClickStar = (index: number) => {
    const newArr = stars.map((_, i) => (i <= index ? true : false));
    setError('');
    setStars([...newArr]);
    setBeforeHover([...newArr]);
  };

  const successSubmit = () => {
    const numberOfStars = beforeHover.filter((val) => val).length;
    if (numberOfStars === 0) {
      setError('Voto é obrigatório');
    } else {
      if (data && pollId) {
        mutate(
          {
            email: methods.getValues('email'),
            pollId,
            description: beforeHover.filter((val) => val).length.toString(),
            questionId: data?.questions[0].id,
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError(e: any) {
              if (
                e.response.data.message == 'user already answered this question'
              ) {
                setError('Esse email já respondeu a pergunta');
              } else {
                setError(
                  'Houve algum problema inesperado ao enviar sua resposta'
                );
              }
            },
            onSuccess() {
              inviteUser(
                {
                  pollId: pollId ?? '',
                  email: methods.getValues('email'),
                },
                {
                  onSuccess() {
                    router.push(
                      PixwayAppRoutes.SIGN_UP_MAIL_CONFIRMATION +
                        '?email=' +
                        methods.getValues('email')
                    );
                  },
                  onError() {
                    setError(
                      'Houve algum problema inesperado ao enviar sua resposta'
                    );
                  },
                }
              );
            },
          }
        );
      }
    }
  };

  return (
    <Box>
      <div className="pw-flex pw-flex-col pw-items-center">
        <p className="pw-text-[24px] pw-font-poppins pw-text-[#35394C] pw-text-center pw-leading-[24px] pw-font-[700]">
          O que achou da experiência?
        </p>
        <p className="pw-text-[18px] pw-font-poppins pw-text-[#35394C] pw-text-center pw-font-[500]">
          {data?.description}
        </p>
        <p className="pw-text-[18px] pw-font-poppins pw-text-[#35394C] pw-text-center pw-font-[500] pw-mt-6">
          {data?.questions[0].description}
        </p>
        <div className="pw-flex pw-gap-x-1 pw-justify-center pw-mt-[30px]">
          {stars.map((star, index) => {
            return (
              <img
                className="pw-cursor-pointer pw-w-[30px] pw-object-contain sm:pw-w-auto"
                onClick={() => onClickStar(index)}
                onMouseOut={onMouseOut}
                onMouseOver={() => changeOnHover(index)}
                key={index}
                src={star ? StarFilled : StarOutlined}
                alt=""
              />
            );
          })}
        </div>
        <div className="pw-flex pw-w-full pw-flex-col pw-mt-[30px]">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(successSubmit)}>
              <AuthTextController
                disabled={Boolean(session?.user.email)}
                name="email"
                label={'Por favor digite seu e-mail'}
                className="pw-mb-3"
                placeholder={translate(
                  'companyAuth>newPassword>enterYourEmail'
                )}
              />
              {error != '' || isError ? (
                <p className="pw-text-xs pw-text-red-500 pw-font-poppins ">
                  {error}
                </p>
              ) : null}
              <WeblockButton
                type="submit"
                tailwindBgColor="pw-bg-brand-primary"
                className="pw-text-white pw-font-[500] pw-mt-[22px] "
                fullWidth={true}
              >
                {translate('components>advanceButton>continue')}
              </WeblockButton>
            </form>
          </FormProvider>
        </div>
      </div>
    </Box>
  );
};
