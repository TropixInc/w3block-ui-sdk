import { useMutation } from 'react-query';

import { CreateUserDto } from '@w3block/sdk-id';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { useGetW3blockIdSDK } from '../../../shared/hooks/useGetW3blockIdSDK';

export const useSignUp = () => {
  const getSDK = useGetW3blockIdSDK();
  return useMutation([PixwayAPIRoutes.USERS], (payload: CreateUserDto) =>
    getSDK().api.users.create(payload)
  );
};
