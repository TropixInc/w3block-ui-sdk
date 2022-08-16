import { useEffect, useMemo, useRef, useState } from 'react';

import { useCompanyId } from '../../../shared/hooks/useCompanyId';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage/useLocalStorage';
import { usePixwayAPIURL } from '../../../shared/hooks/usePixwayAPIURL/usePixwayAPIURL';
import { createOrderApi } from '../../api/createOrder';
import { CreateOrder } from '../../api/createOrder/interface';
import { PRODUCT_CART_INFO_KEY } from '../../config/keys/localStorageKey';

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiODkxOWI2Yy1mMTQ2LTRkODQtODg2ZS04OGZlY2E0YzM3ZTkiLCJpc3MiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJhdWQiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJlbWFpbCI6InBpeHdheUB3M2Jsb2NrLmlvIiwibmFtZSI6IlBpeHdheSIsInJvbGVzIjpbInVzZXIiXSwiY29tcGFueUlkIjoiZThhOTgxNGUtMThhMS00ZjUyLWI2Y2EtYzE1ZjBhZTIyOTRhIiwidGVuYW50SWQiOiJlOGE5ODE0ZS0xOGExLTRmNTItYjZjYS1jMTVmMGFlMjI5NGEiLCJ2ZXJpZmllZCI6dHJ1ZSwidHlwZSI6InVzZXIiLCJpYXQiOjE2NjAzMjgxMjAsImV4cCI6MTY2MDkzMjkyMH0.fbHIOVrgwRI_zS8W-bsaYGV5vpXS4orQJToXBZsBl1Gr6sm6i_FDI6DOq5TB_3sDjzyvwhB2JBvmW_32Qv9MmbYtFXukxPf8ZEKn3qAigOsmnc-icAe66Rb6eDns6C0tsNcbt_zWVz3ntAq1BUyaFSiqhdyPCrK4cjarQ6Q-I3k';

export const CheckoutPayment = () => {
  const [_, setOrderInfos] = useState<CreateOrder | null>(null);
  const shouldLock = useRef(true);
  const [sending, setSending] = useState<boolean>(false);
  const baseUrl = usePixwayAPIURL();
  const companyId = useCompanyId();
  const [iframeLink, setIframeLink] = useState('');
  const { getItem } = useLocalStorage();

  useEffect(() => {
    if (shouldLock.current) {
      shouldLock.current = false;
      createOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createOrder = () => {
    const orderInfo = getItem<CreateOrder>(PRODUCT_CART_INFO_KEY);
    setOrderInfos(orderInfo);
    if (orderInfo && !iframeLink && !sending) {
      setSending(true);
      createOrderApi(baseUrl, token, companyId, orderInfo).then((res) => {
        if (res) {
          setIframeLink(res.paymentInfo.paymentUrl);
          setSending(false);
        }
      });
    }
  };

  const IframeItem = useMemo(() => {
    return iframeLink ? (
      <iframe className="pw-w-full pw-min-h-screen" src={iframeLink} />
    ) : null;
  }, [iframeLink]);

  return <div className="">{IframeItem}</div>;
};
