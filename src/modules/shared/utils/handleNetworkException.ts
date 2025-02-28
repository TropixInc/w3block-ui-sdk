import axios from 'axios';

type Rule = {
  criteria: 'message' | 'messageLike' | 'statusCode';
  values: Array<string | number>;
  message: string;
  errorCode?: string;
};
type NetworkException = {
  errorCode: string;
  message: string;
  statusCode: number;
  info?: any;
};
export function handleNetworkException(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  e: any,
  rules: Array<Rule> = [],
  info?: any
): NetworkException {
  if (axios.isAxiosError(e as any)) {
    console.log('*** Axios Exception', e.response?.data);
    const r = {
      errorCode: 'unknown',
      type: 'unknown',
      message: e?.response?.data?.message,
      statusCode: e?.response?.status || -1,
      info,
      data: e?.response?.data?.data,
    };
    rules.some(({ criteria, values, message, errorCode = '' }) => {
      if (criteria === 'message' || criteria === 'messageLike') {
        if (
          (Array.isArray(e?.response?.data?.message) &&
            values.some((v) => {
              if (criteria === 'messageLike')
                return (
                  e?.response?.data?.message[0]
                    ?.toLowerCase()
                    .indexOf(v?.toString().toLowerCase()) > -1
                );
              return v === e?.response?.data?.message[0];
            })) ||
          values.some((v) => {
            if (criteria === 'messageLike')
              return (
                e?.response?.data?.message
                  ?.toLowerCase()
                  .indexOf(v?.toString().toLowerCase()) > -1
              );
            return v === e?.response?.data?.message;
          })
        ) {
          r.errorCode = errorCode;
          r.type = errorCode;
          r.message = message;
          return true;
        }
      } else if (
        criteria === 'statusCode' &&
        values.some((v) => v === e?.response?.status)
      ) {
        r.errorCode = errorCode;
        r.type = errorCode;
        r.message = message;
        return true;
      }
    });
    return r;
  } else {
    console.log('*** Non-Axios Exception', e);
    return {
      errorCode: e?.errorCode || 'unknown',
      message:
        e?.message || 'Erro ao realizar operação. Por favor, tente novamente.',
      statusCode: e?.statusCode || -1,
      info,
    };
  }
}
