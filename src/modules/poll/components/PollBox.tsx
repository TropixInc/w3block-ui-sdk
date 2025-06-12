import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosResponse } from 'axios';
import { object, string } from 'yup';

import StarFilled from '../../../shared/assets/icons/starFilled.png';
import StarOutlined from '../../../shared/assets/icons/starOutlined.png';

import { IPollInterface } from './IPollInterface';

import { AuthTextController } from '../../auth/components/AuthTextController';
import { Box } from '../../shared/components/Box';
import { FallbackImage } from '../../shared/components/FallbackImage';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { PixwayAppRoutes } from '../../shared/enums/PixwayAppRoutes';
import { useIsProduction } from '../../shared/hooks/useIsProduction';
import { usePixwaySession } from '../../shared/hooks/usePixwaySession';
import { useRouterConnect } from '../../shared/hooks/useRouterConnect';
import { usePollBySlug } from '../hooks/usePollBySlug';
import { usePostAnswer } from '../hooks/usePostAnswer';
import { useSendToPipeForm } from '../hooks/useSendToPipeForm';
import { PostAnswerResponseInterface } from '../interfaces/PollResponseInterface';
import { AchievedLimit } from './AchievedLimit';
import { AlreadyAnswerBox } from './AlreadyAnswerBox';
import useTranslation from '../../shared/hooks/useTranslation';

interface PollBoxProps {
  slug?: string;
  redirectWithoutPoll?: string;
}

export const PollBox = ({
  slug,
  redirectWithoutPoll = PixwayAppRoutes.SIGN_IN,
}: PollBoxProps) => {
  const router = useRouterConnect();
  const [translate] = useTranslation();
  const { mutate: sendPipe } = useSendToPipeForm();
  const isProduction = useIsProduction();
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [achievedLimit, setAchievedLimit] = useState(false);
  const { slug: slugQuery } = router.query;
  const { data: session } = usePixwaySession();
  const [error, setError] = useState('');
  slug = slug ?? (slugQuery as string);

  const { data, isError } = usePollBySlug(slug);
  const { mutate, isLoading } = usePostAnswer();

  const schema = object().shape({
    email: string().email().required(),
  });

  useEffect(() => {
    if ((!slug && router.isReady) || isError) {
      router.pushConnect(redirectWithoutPoll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, router.isReady, isError]);

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
      setError(translate('auth>poll>voteRequired'));
    } else {
      if (data && data.id && slug) {
        isProduction &&
          sendPipe({
            email: methods.getValues('email'),
            pollId: data.id,
            slug: data.slug,
            description: beforeHover.filter((val) => val).length.toString(),
            questionId: data?.questions[0].id,
          });

        mutate(
          {
            email: methods.getValues('email'),
            pollId: data.id,
            slug: data.slug,
            description: beforeHover.filter((val) => val).length.toString(),
            questionId: data?.questions[0].id,
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError(e: any) {
              if (
                e.response.data.message == 'user already answered this question'
              ) {
                setAlreadyAnswered(true);
                setError(translate('auth>poll>alreadyAnswered'));
              } else {
                setError(translate('auth>poll>unexpectedError'));
              }
            },
            onSuccess(data: AxiosResponse<PostAnswerResponseInterface>) {
              if (data.data.achievedLimit) {
                setAchievedLimit(true);
              } else if (!session && data.data.newUser) {
                router.pushConnect(
                  PixwayAppRoutes.VERIfY_WITH_CODE +
                    `?email=${encodeURIComponent(methods.getValues('email'))}`
                );
              } else if (!session && !data.data.newUser) {
                router.pushConnect(PixwayAppRoutes.SIGN_IN);
              } else if (session) {
                router.pushConnect(PixwayAppRoutes.MY_TOKENS);
              }
            },
          }
        );
      }
    }
  };

  return alreadyAnswered ? (
    <AlreadyAnswerBox />
  ) : achievedLimit ? (
    <AchievedLimit />
  ) : (
    <Box>
      <div className="pw-flex pw-flex-col pw-items-center">
        <p className="pw-text-[24px] pw-font-poppins pw-text-[#35394C] pw-text-center pw-leading-[24px] pw-font-[700]">
          {translate('auth>poll>thinkExperience')}
        </p>
        {data?.imageUrl && data.imageUrl != '' ? (
          <img
            className="pw-max-w-[260px] pw-w-full pw-h-full pw-object-cover pw-max-h-[260px] pw-my-6 pw-rounded-md"
            src={data?.imageUrl}
            alt={data?.description}
          />
        ) : (
          <FallbackImage className="pw-max-w-[260px] pw-min-w-[260px] pw-min-h-[260px] pw-object-cover pw-max-h-[260px] pw-my-6 pw-rounded-md" />
        )}

        <p className="pw-text-[20px] pw-leading-8  pw-font-poppins pw-text-[#295BA6] pw-text-center pw-font-[700]">
          {data?.description}
        </p>
        <p className="pw-text-[18px] pw-font-poppins pw-text-[#35394C] pw-text-center pw-font-[500] pw-mt-6">
          {translate('auth>poll>question')}
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
              {!session ? (
                <>
                  <AuthTextController
                    name="email"
                    label={translate('components>shared>pleaseTypeEmail')}
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
                </>
              ) : null}

              <WeblockButton
                type="submit"
                tailwindBgColor="pw-bg-brand-primary"
                className="pw-text-white pw-font-[500] pw-mt-[22px] "
                fullWidth={true}
                disabled={isLoading}
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
