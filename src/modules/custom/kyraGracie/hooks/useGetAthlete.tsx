import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { MetadataApiInterface } from '../../../shared/interface/metadata/metadata';
import { handleNetworkException } from '../../../shared/utils/handleNetworkException';

export enum BeltColor {
  WHITE = 'White',
  GRAY_AND_WHITE = 'Gray and White',
  GRAY = 'Gray',
  GRAY_AND_BLACK = 'Gray and Black',
  YELLOW_AND_WHITE = 'Yellow and White',
  YELLOW = 'Yellow',
  YELLOW_AND_BLACK = 'Yellow and Black',
  ORANGE_AND_WHITE = 'Orange and White',
  ORANGE = 'Orange',
  ORANGE_AND_BLACK = 'Orange and Black',
  GREEN_AND_WHITE = 'Green and White',
  GREEN = 'Green',
  GREEN_AND_BLACK = 'Green and Black',
  BLUE = 'Blue',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BLACK = 'Black',
  RED = 'Red',
  RED_AND_BLACK = 'Red and Black',
  RED_AND_WHITE = 'Red and White',
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
  degree?: string;
}

const address = '0xda859035c78cfa6423cf9388e23e72db1ad2c583';
const chainId = '1284';

export const useGetAthlete = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const filter = { athleteIdentification: Number(id) };

  return useQuery(
    [PixwayAPIRoutes.METADATA_BY_ADDRESS_AND_CHAINID, companyId, id],
    async () => {
      try {
        const response = await axios.get(
          PixwayAPIRoutes.METADATA_BY_ADDRESS_AND_CHAINID.replace(
            '{companyId}',
            companyId
          )
            .replace('{address}', address)
            .replace('{chainId}', chainId) +
            `?metadataFilter=${encodeURI(JSON.stringify(filter))}&limit=30`
        );
        return response.data as {
          items: MetadataApiInterface<AthleteInterface>[];
        };
      } catch (error) {
        console.error('Erro ao buscar dados do atleta:', error);
        throw handleNetworkException(error);
      }
    },
    {
      enabled: id != undefined && id != '',
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
