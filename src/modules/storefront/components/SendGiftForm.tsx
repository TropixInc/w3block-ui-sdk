/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { DataFields } from '../interfaces/Product';



interface Params {
  dataFields: DataFields[];
  isSendGift: boolean;
  setIsSendGift: Dispatch<SetStateAction<boolean>>;
  data: any;
  setData: Dispatch<any>;
  deleteKey: () => void;
}

export const SendGiftForm = ({
  dataFields,
  isSendGift,
  setIsSendGift,
  data,
  setData,
  deleteKey,
}: Params) => {
  const [translate] = useTranslation();
  useEffect(() => {
    deleteKey();
  }, []);
  return (
    <div className="pw-mt-5 pw-text-black">
      <p className="pw-font-medium">
        {translate('storefront>sendGiftForm>sendGift')}
      </p>
      <div className="pw-mt-3 pw-flex pw-gap-x-4">
        <div className="pw-flex pw-gap-2 pw-items-center">
          <input
            type="radio"
            name="sendGift"
            checked={isSendGift}
            onChange={() => {
              deleteKey();
              setIsSendGift(true);
            }}
            id="yes"
            className="pw-w-5"
          />
          <label className="pw-cursor-pointer" htmlFor="yes">
            {translate('shared>yes')}
          </label>
        </div>
        <div className="pw-flex pw-gap-2 pw-items-center">
          <input
            type="radio"
            name="sendGift"
            checked={!isSendGift}
            onChange={() => {
              setData('selfBuy');
              setIsSendGift(false);
            }}
            id="no"
          />
          <label className="pw-cursor-pointer" htmlFor="no">
            {translate('shared>no')}
          </label>
        </div>
      </div>

      {isSendGift ? (
        <div className="pw-mt-5 pw-flex pw-flex-col pw-gap-5">
          {dataFields.map((res, index) => {
            return (
              <div key={index} className="pw-w-full pw-flex pw-flex-col">
                <label htmlFor="receivedName">
                  {res.label}
                  {res.required ? '*' : ''}
                </label>
                {res.type === 'text' ? (
                  <input
                    id={res.name}
                    required={res.required}
                    value={data && data[res?.name] ? data[res?.name] : ''}
                    onChange={(e) =>
                      setData({ ...data, [res.name]: e.target.value })
                    }
                    type="text"
                    className="pw-mt-1 pw-px-3 pw-py-2 pw-border pw-border-slate-500 pw-outline-none pw-rounded-lg pw-text-sm"
                  />
                ) : (
                  <textarea
                    className="pw-mt-1 pw-px-3 pw-py-2 pw-border pw-border-slate-500 pw-outline-none pw-rounded-lg pw-text-sm"
                    value={data && data[res?.name] ? data[res?.name] : ''}
                    onChange={(e) =>
                      setData({ ...data, [res.name]: e.target.value })
                    }
                    id={res.name}
                    required={res.required}
                    cols={30}
                    rows={10}
                  ></textarea>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
