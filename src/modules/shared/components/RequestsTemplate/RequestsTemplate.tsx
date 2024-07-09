import { usePrivateRoute } from '../../hooks/usePrivateRoute';
import { InternalpageHeaderWithFunds } from '../InternalPageHeaderWithFunds/InternalPageHeaderWithFunds';
import { InternalPagesLayoutBase } from '../InternalPagesLayoutBase';
import RequestsList from '../RequestsList';
import TranslatableComponent from '../TranslatableComponent';

const _RequestsTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  return isAuthorized && !isLoading ? (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds title="Solicitações" />
        <RequestsList />
      </InternalPagesLayoutBase>
    </div>
  ) : null;
};

export const RequestsTemplate = () => {
  return (
    <TranslatableComponent>
      <_RequestsTemplate />
    </TranslatableComponent>
  );
};
