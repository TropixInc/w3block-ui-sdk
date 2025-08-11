import { usePrivateRoute } from "../hooks/usePrivateRoute";
import { CardsList } from "./CardsList";
import { InternalpageHeaderWithFunds } from "./InternalPageHeaderWithFunds";
import { InternalPagesLayoutBase } from "./InternalPagesLayoutBase";
import TranslatableComponent from "./TranslatableComponent";

const _CardsListTemplate = () => {
  const { isAuthorized, isLoading } = usePrivateRoute();
  return isAuthorized && !isLoading ? (
    <div>
      <InternalPagesLayoutBase>
        <InternalpageHeaderWithFunds title="Cartões de Crédito" />
        <CardsList />
      </InternalPagesLayoutBase>
    </div>
  ) : null;
};

export const CardsListTemplate = () => {
  return (
    <TranslatableComponent>
      <_CardsListTemplate />
    </TranslatableComponent>
  );
};
