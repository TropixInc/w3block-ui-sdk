/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable i18next/no-literal-string */
import { useMemo, useRef, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { QRCodeSVG } from 'qrcode.react';

import ChevronDown from '../../shared/assets/icons/arrowDown.svg';
import CopyIcon from '../../shared/assets/icons/copy.svg';
import { BaseButton } from '../../shared/components/Buttons';
import { UI } from '../../shared/components/ui/tokens';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { useProfileWithKYC } from '../../shared/hooks/useProfileWithKYC';
import useTranslation from '../../shared/hooks/useTranslation';
import { useWindowLocation } from '../../shared/hooks/useWindowLocation';
import { useThemeConfig } from '../../storefront/hooks/useThemeConfig';

interface ReferralProps {
  baseSharedPath?: string;
  shareMenssage?: string;
}

/**
 * Referral link, share buttons and QR code. Rendered where the tenant's
 * HTML puts `{referralWidget}`; the QR opens by default only when the
 * theme asks for it (`showAffiliateQrCode`).
 */
export const ReferralWidget = ({
  baseSharedPath,
  shareMenssage,
}: ReferralProps) => {
  const [translate] = useTranslation();
  const theme = useThemeConfig();
  const showQrCode =
    theme?.defaultTheme?.configurations?.contentData?.showAffiliateQrCode;
  const isMobile = useIsMobile();
  const { profile } = useProfileWithKYC();
  const { host } = useWindowLocation();
  const [copied, setCopied] = useState<'link' | 'message' | null>(null);
  const [state, copyToClipboard] = useCopyToClipboard();
  const qrRef = useRef<HTMLDivElement>(null);
  const referralCode = (profile as any)?.referralCode as string | undefined;

  const link = useMemo(() => {
    if (!referralCode) return '';
    const base = baseSharedPath
      ? `https://${host}/${baseSharedPath}/`
      : `https://${host}/`;
    return `${base}?utm_campaign=m2m&utm_source=${referralCode}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralCode, baseSharedPath, host]);

  const flash = (what: 'link' | 'message') => {
    if (!state.error) setCopied(what);
    setTimeout(() => setCopied(null), 3000);
  };
  const handleCopy = () => {
    copyToClipboard(link);
    flash('link');
  };
  const handleShared = () => {
    copyToClipboard(
      shareMenssage ? shareMenssage.replace('{shareLink}', link) : link
    );
    flash('message');
  };

  const whatsappLink = shareMenssage
    ? shareMenssage.replace('{shareLink}', link)
    : link;
  const whatsappHref = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(whatsappLink)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappLink)}`;

  // Serialises the rendered SVG into a PNG the user can save or send.
  const downloadQr = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg || typeof document === 'undefined') return;
    const size = 640;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 40, 40, size - 80, size - 80);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `convite-${referralCode ?? 'qr'}.png`;
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="pw-max-w-[640px] pw-w-full pw-my-4 pw-flex pw-flex-col pw-gap-3">
      <label className={classNames('pw-block', UI.label)}>
        {translate('affiliates>referralWidget>yourLink')}
      </label>
      <div className="pw-flex pw-items-center pw-gap-2 pw-h-10 pw-px-3 pw-rounded-lg pw-border pw-border-dashed pw-border-[#C5C9D1] pw-bg-[#F7F8FA] pw-min-w-0">
        <p
          className={classNames(
            'pw-flex-1 pw-min-w-0 pw-text-[13px] pw-truncate pw-m-0 pw-tabular-nums',
            UI.text
          )}
          title={link}
        >
          {copied === 'link'
            ? translate('components>menu>copied')
            : link || '—'}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!link}
          className="pw-inline-flex pw-items-center pw-gap-1 pw-text-[12px] pw-font-semibold pw-text-brand-primary pw-shrink-0 disabled:pw-opacity-50"
          aria-label={translate('affiliates>referralWidget>copy')}
        >
          <CopyIcon width={14} height={14} className="pw-stroke-current" />
          {translate('affiliates>referralWidget>copy')}
        </button>
      </div>
      <div className="pw-flex pw-flex-col sm:pw-flex-row pw-gap-2">
        <a
          target="_blank"
          href={whatsappHref}
          data-action="share/whatsapp/share"
          rel="noreferrer"
          className={classNames(UI.buttonSecondary, 'pw-flex-1')}
        >
          WhatsApp
        </a>
        <BaseButton onClick={handleShared} className="pw-flex-1">
          {copied === 'message'
            ? translate('components>menu>copied')
            : translate('affiliates>referrakWidget>shared')}
        </BaseButton>
      </div>
      <Disclosure defaultOpen={showQrCode}>
        {({ open }) => (
          <div
            className={classNames(
              UI.card,
              'pw-border pw-border-[#EEF0F3] pw-px-4 pw-py-3'
            )}
          >
            <Disclosure.Button className="pw-flex pw-w-full pw-items-center pw-justify-between pw-gap-3 pw-text-left">
              <span
                className={classNames(
                  'pw-text-[13px] pw-font-semibold',
                  UI.text
                )}
              >
                {translate('affiliates>referralWidget>QRCode')}
              </span>
              <ChevronDown
                className={classNames(
                  'pw-stroke-[#4A5567] pw-shrink-0',
                  open ? 'pw-rotate-180' : ''
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel>
              <div className="pw-flex pw-flex-col sm:pw-flex-row pw-items-center pw-gap-4 pw-mt-3">
                <div
                  ref={qrRef}
                  className="pw-p-2 pw-bg-white pw-rounded-lg pw-border pw-border-[#E6E8EC]"
                >
                  <QRCodeSVG value={link || ' '} size={180} />
                </div>
                <div className="pw-flex pw-flex-col pw-gap-2 pw-text-center sm:pw-text-left">
                  <p
                    className={classNames(
                      'pw-text-[12.5px] pw-m-0',
                      UI.textMuted
                    )}
                  >
                    {translate('affiliates>referralWidget>qrHint')}
                  </p>
                  <button
                    type="button"
                    onClick={downloadQr}
                    disabled={!link}
                    className={classNames(
                      UI.buttonSecondary,
                      'pw-self-center sm:pw-self-start disabled:pw-opacity-50'
                    )}
                  >
                    {translate('affiliates>referralWidget>downloadImage')}
                  </button>
                </div>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
};
