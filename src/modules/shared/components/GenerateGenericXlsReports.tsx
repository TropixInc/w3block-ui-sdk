/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { W3blockAPI } from '../enums/W3blockAPI';
import { BaseButton } from './Buttons';
import { ErrorBox } from './ErrorBox';
import { Spinner } from './Spinner';
import { UseGenericApiGet } from '../hooks/UseGenericApiGet';
import { useGetGenericXlsReports } from '../hooks/useGetGenericXlsReports';
import useTranslation from '../hooks/useTranslation';


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

  const {
    data: reportXls,
    isSuccess,
    isError,
    error,
  } = UseGenericApiGet({
    url: urlReports ?? '',
    context: context,
  });

  const {
    data: downloadReport,
    isError: isErrorXls,
    error: errorXls,
  } = useGetGenericXlsReports({
    url: xlsUrl ?? '',
    context: context,
    enabled: enableGetReport,
  });

  useEffect(() => {
    if (isSuccess && reportXls && reportXls?.data?.status !== 'failed') {
      setXlsUrl(xlsUrl?.replace('{exportId}', reportXls?.data?.id));
      setEnableGetReport(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, reportXls]);

  useEffect(() => {
    if (downloadReport?.asset?.directLink) {
      setDownloadLink(downloadReport?.asset?.directLink);
    }
  }, [downloadReport?.asset?.directLink]);

  useEffect(() => {
    if (downloadLink) {
      setXlsLoading(false);
      setEnableGetReport(false);
    }
  }, [downloadLink]);

  useEffect(() => {
    if (isErrorXls || isError) {
      setXlsLoading(false);
      setEnableGetReport(false);
      setUrlReports('');
      setDownloadLink('');
    }
  }, [isError, isErrorXls]);

  useEffect(() => {
    if (
      reportXls?.data?.status === 'failed' ||
      downloadReport?.data?.status === 'failed'
    ) {
      setXlsLoading(false);
      setEnableGetReport(false);
      setUrlReports('');
      setDownloadLink('');
    }
  }, [downloadReport?.data?.status, reportXls?.data?.status]);

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

      <ErrorBox customError={error as any} />
      <ErrorBox customError={errorXls as any} />
    </div>
  );
};
