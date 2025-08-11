/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import classNames from 'classnames';
import * as openpgp from 'openpgp';

import { Alert } from '../../shared/components/Alert';
import { WeblockButton } from '../../shared/components/WeblockButton';
import { DecryptModal } from './DecryptModal';
import useTranslation from '../../shared/hooks/useTranslation';

export interface TextFieldDisplayClasses {
  root?: string;
  label?: string;
  value?: string;
}

interface Props {
  className?: string;
  label: string;
  value: string;
  inline?: boolean;
  classes?: TextFieldDisplayClasses;
}

export const TextFieldEncrypted = ({
  label,
  value,
  className = '',
  inline = false,
  classes = {},
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [decryptedText, setDecryptedText] = useState(value);
  const [decrypted, setIsDecrypted] = useState(false);
  const [translate] = useTranslation();
  const [error, setError] = useState('');
  const decryptText = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      const privateKeyArmored = await openpgp.readPrivateKey({
        armoredKey: formData.get('decryptedKey') as string,
      });
      const message = await openpgp.readMessage({
        armoredMessage: value,
      });
      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKeyArmored,
      });
      setDecryptedText(decrypted as string);
      setError('');
      setIsDecrypted(true);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onSubmit = (e: any) => {
    decryptText(e);
    setIsOpen(false);
  };
  return (
    <>
      <div
        className={classNames(
          className,
          classes.root ?? '',
          'pw-flex pw-flex-col pw-gap-y-2 pw-break-words'
        )}
      >
        <div className="pw-flex pw-flex-col pw-gap-2">
          <h2
            className={classNames(
              'pw-font-medium pw-text-base pw-leading-[19px] pw-text-black',
              classes.label ?? '',
              inline ? 'pw-inline' : ''
            )}
          >
            {label}:
          </h2>
          <div
            className={classNames(
              'pw-font-base pw-leading-[19px] pw-text-[#676767]',
              classes.value ?? '',
              inline ? 'pw-inline' : ''
            )}
            dangerouslySetInnerHTML={{
              __html: decryptedText.replace('\n', '<br />'),
            }}
          ></div>
        </div>
        {decrypted ? (
          <WeblockButton
            className="pw-text-white"
            onClick={() => {
              setDecryptedText(value);
              setIsDecrypted(false);
            }}
          >
            {translate('tokens>textFieldEncrypted>encrypt')}
          </WeblockButton>
        ) : (
          <WeblockButton
            className="pw-text-white"
            onClick={() => {
              setIsOpen(true);
              setError('');
            }}
          >
            {translate('tokens>decryptModal>decrypt')}
          </WeblockButton>
        )}
        {error !== '' && (
          <Alert variant="error">
            <Alert.Icon></Alert.Icon>
            <p>{translate('tokens>textFieldEncrypted>incorrectKey')}</p>
          </Alert>
        )}
      </div>
      <DecryptModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};
