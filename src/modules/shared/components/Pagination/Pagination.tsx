import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { number, object } from 'yup';

import TokenizationFormItemContainer from '../../../tokens/components/TokenizationFormItemContainer/TokenizationFormItemContainer';
import { getNumbersFromString } from '../../../tokens/utils/getNumbersFromString';
import ChevronLeft from '../../assets/icons/chevronLeftFilled.svg?react';
import ChevronRight from '../../assets/icons/chevronRightFilled.svg?react';
import useTranslation from '../../hooks/useTranslation';
import { PixwayButton } from '../PixwayButton';

interface Props {
  pagesQuantity: number;
  currentPage: number;
  onChangePage: (nextPage: number) => void;
}

interface Form {
  page: number;
}

export const Pagination = ({
  pagesQuantity,
  currentPage,
  onChangePage,
}: Props) => {
  const [currentPagesQuantity, setCurrentPagesQuantity] =
    useState(pagesQuantity);
  const [translate] = useTranslation();

  const schemaRef = useRef(
    object().shape({
      page: number().min(1),
    })
  );

  const methods = useForm<Form>({
    defaultValues: {
      page: currentPage ? currentPage : 1,
    },
    mode: 'onChange',
    resolver: yupResolver(schemaRef.current),
  });
  const { page } = useWatch({ control: methods.control });

  const isPageQuantityInvalid =
    (page && Number(page) > currentPagesQuantity) ||
    (page && Number(page) == 0);

  useEffect(() => {
    if (pagesQuantity && pagesQuantity !== currentPagesQuantity) {
      setCurrentPagesQuantity(pagesQuantity);
    }
  }, [pagesQuantity, currentPagesQuantity]);

  useEffect(() => {
    if (isPageQuantityInvalid) {
      methods.setError('page', { message: 'invalid page' });
    } else {
      methods.trigger('page');
    }
  }, [isPageQuantityInvalid, methods]);

  useEffect(() => {
    methods.setValue('page', currentPage, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [currentPage, methods]);

  const onInputBlur = (cb: () => void) => {
    cb();
    if (!isPageQuantityInvalid) {
      onChangePage(Number(methods.getValues('page')));
    }
  };

  const onEnterInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      if (!isPageQuantityInvalid) {
        onChangePage(Number(methods.getValues('page')));
      }
    }
  };

  const onPreviousPage = () => {
    const previousPage = currentPage - 1;
    methods.setValue('page', previousPage);
    if (previousPage <= currentPagesQuantity) {
      onChangePage(previousPage);
    }
  };

  const onNextPage = () => {
    const nextPage = currentPage + 1;
    methods.setValue('page', nextPage);
    if (nextPage <= currentPagesQuantity) {
      onChangePage(nextPage);
    }
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    cb: (event: ChangeEvent<HTMLInputElement>) => void
  ) => {
    event.target.value = getNumbersFromString(event.target.value, false);
    return cb(event);
  };

  return (
    <div className="pw-flex pw-items-center pw-gap-x-4">
      <Controller
        name="page"
        control={methods.control}
        render={({ field: { onBlur, onChange, ...rest } }) => (
          <TokenizationFormItemContainer
            invalid={methods.getFieldState('page').invalid}
          >
            <input
              {...rest}
              disabled={pagesQuantity === 1}
              onChange={(event) => onInputChange(event, onChange)}
              onKeyDown={(event) => onEnterInput(event)}
              onBlur={() => onInputBlur(onBlur)}
              className="pw-w-[41px] pw-py-2.5 pw-text-center pw-font-normal pw-leading-[19px] pw-text-black pw-outline-none pw-bg-transparent"
            />
          </TokenizationFormItemContainer>
        )}
      />

      <p className="pw-text-sm pw-leading-4 pw-text-black">
        {translate('wallet>paginationController>totalPagesLabel', {
          pagesQuantity: currentPagesQuantity,
        })}
      </p>
      <div className="pw-flex pw-gap-x-1 pw-items-center">
        <PixwayButton
          className="!pw-px-[15px] !pw-py-2.5 !pw-bg-[#5682C3] disabled:!pw-bg-[#94B8ED]"
          disabled={currentPage <= 1}
          onClick={onPreviousPage}
        >
          <ChevronLeft className="pw-fill-white pw-w-[10.5px] pw-h-[19.5px]" />
        </PixwayButton>
        <PixwayButton
          className="!pw-px-[15px] !pw-py-2.5 !pw-bg-[#5682C3] disabled:!pw-bg-[#94B8ED]"
          disabled={currentPage >= currentPagesQuantity}
          onClick={onNextPage}
        >
          <ChevronRight className="pw-fill-white pw-w-[10.5px] pw-h-[19.5px]" />
        </PixwayButton>
      </div>
    </div>
  );
};
