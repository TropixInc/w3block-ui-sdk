/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { W3blockAPI } from '../../enums/W3blockAPI';
import { UseGenericApiGet } from '../../hooks/UseGenericApiGet/UseGenericApiGet';
import { useGetGenericXlsReports } from '../../hooks/useGetGenericXlsReports';
import useTranslation from '../../hooks/useTranslation';
import { BaseButton } from '../Buttons';
import { Spinner } from '../Spinner/Spinner';

interface XlsReportsProps {
  url: string;
  context: W3blockAPI;
  observerUrlReport: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: any;
  sort?: string;
  styleClass?: any;
}

export const GenerateGenericXlsReports = ({
  context,
  url,
  filters,
  observerUrlReport,
  sort,
}: XlsReportsProps) => {
  const [translate] = useTranslation();
  const [urlReports, setUrlReports] = useState<string>('');
  const [isXlsLoading, setXlsLoading] = useState(false);
  const [xlsUrl, setXlsUrl] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [enableGetReport, setEnableGetReport] = useState(false);
  const [error, setError] = useState(false);

  const {
    data: reportXls,
    isSuccess,
    isError,
  } = UseGenericApiGet({
    url: urlReports ?? '',
    context: context,
  });

  const { data: donwloadReport, isError: isErrorXls } = useGetGenericXlsReports(
    {
      url: xlsUrl ?? '',
      context: context,
      enabled: enableGetReport,
    }
  );

  useEffect(() => {
    if (isSuccess && reportXls && reportXls?.data?.status !== 'failed') {
      setXlsUrl(xlsUrl?.replace('{exportId}', reportXls?.data?.id));
      setEnableGetReport(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reportXls]);

  useEffect(() => {
    if (donwloadReport?.data?.asset?.directLink) {
      setDownloadLink(donwloadReport?.data?.asset?.directLink);
    }
  }, [donwloadReport?.data?.asset?.directLink]);

  useEffect(() => {
    if (downloadLink) {
      setXlsLoading(false);
      setEnableGetReport(false);
    }
  }, [downloadLink]);

  useEffect(() => {
    if (isErrorXls || isError) {
      setError(true);
      setXlsLoading(false);
      setEnableGetReport(false);
      setUrlReports('');
      setDownloadLink('');
    }
  }, [isError, isErrorXls]);

  useEffect(() => {
    if (
      reportXls?.data?.status === 'failed' ||
      donwloadReport?.data?.status === 'failed'
    ) {
      setError(true);
      setXlsLoading(false);
      setEnableGetReport(false);
      setUrlReports('');
      setDownloadLink('');
    }
  }, [donwloadReport?.data?.status, reportXls?.data?.status]);

  const handleCallReportXls = () => {
    const arrFilters = Object.values(filters);
    const filteredArrFilters = arrFilters.filter(
      (item) => (item as string)?.length > 0
    );

    if (filteredArrFilters.length) {
      if (url?.includes('?')) {
        setUrlReports(`${url}&${filteredArrFilters.join('&')}&${sort}`);
      } else {
        setUrlReports(`${url}?${filteredArrFilters.join('&')}&${sort}`);
      }
    } else {
      if (sort) {
        if (url.includes('?')) {
          setUrlReports(`${url}&${sort}`);
        } else {
          setUrlReports(`${url}?${sort}`);
        }
      } else {
        setUrlReports(url);
      }
    }

    setXlsUrl(`${observerUrlReport}?${filteredArrFilters.join('&')}`);
    setXlsLoading(true);
  };

  const onHandleDownload = () => {
    window.open(downloadLink ?? '', '_blank');

    setDownloadLink('');
  };

  return (
    <div className="pw-w-full pw-relative pw-flex pw-flex-col pw-items-end pw-mb-2">
      <BaseButton
        onClick={() => handleCallReportXls()}
        disabled={isXlsLoading}
        className="pw-h-[44px] pw-min-w-[150px]"
      >
        {isXlsLoading ? (
          <div className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 ">
            <Spinner className="pw-w-4 pw-h-4 !pw-border-2" />
            <p>{translate('tokens>generateGenericXlsReports>await')}</p>
          </div>
        ) : (
          <p>{translate('key>salesReportsTemplate>exportReport')}</p>
        )}
      </BaseButton>

      {Boolean(downloadLink) && (
        <button
          onClick={() => onHandleDownload()}
          className="pw-block pw-mt-2 pw-underline pw-text-blue1 pw-absolute hover:pw-drop-shadow sm:-pw-left-[3rem] sm:!pw-top-[40px]"
        >
          {translate('key>salesReportsTemplate>download')}
        </button>
      )}

      {error && (
        <p className="pw-block pw-mt-2 pw-text-red-400">
          {translate('home>contactModal>error')}
        </p>
      )}
    </div>
  );
};
