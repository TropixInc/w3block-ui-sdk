import { useQuery } from '@tanstack/react-query';
import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { MetadataApiInterface } from '../../../shared/interfaces/metadata';

export enum BeltColor {
  BLUE = 'Blue',
  WHITE = 'White',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BLACK = 'Black',
  RED = 'Red',
  CORAL = 'Coral',
  YELLOW = 'Yellow',
  ORANGE = 'Orange',
}

export interface AthleteInterface {
  athleteIdentification: number;
  athleteName: string;
  athleteGender: string;
  athleteBirthdate: string;
  beltColor: BeltColor;
  graduationDate: string;
  graduationAcademy: string;
  graduationTeacher: string;
  athleteNationality: string;
  dateOfIssue: string;
}

export const useGetAthleteByAddress = (
  id: string,
  address: string,
  chainId: string
) => {
  const axios = useAxios(W3blockAPI.KEY);
  const filter = { instructorIdentification: `${id}` };
  return useQuery(
    [PixwayAPIRoutes.METADATA_BY_ADDRESS_AND_CHAINID, address, chainId, id],
    () =>
      axios
        .get(
          PixwayAPIRoutes.METADATA_BY_ADDRESS_AND_CHAINID.replace(
            '{address}',
            address
          ).replace('{chainId}', chainId) +
            `?metadataFilter=${encodeURI(JSON.stringify(filter))}&limit=30`
        )
        .then(
          (data): { items: MetadataApiInterface<AthleteInterface>[] } =>
            data.data
        ),
    {
      enabled: id != '',
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
