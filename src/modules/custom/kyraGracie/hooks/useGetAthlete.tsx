import { useQuery } from 'react-query';

import { PixwayAPIRoutes } from '../../../shared/enums/PixwayAPIRoutes';
import { W3blockAPI } from '../../../shared/enums/W3blockAPI';
import { useAxios } from '../../../shared/hooks/useAxios';
import { useCompanyConfig } from '../../../shared/hooks/useCompanyConfig';
import { MetadataApiInterface } from '../../../shared/interface/metadata/metadata';

export enum BeltColor {
  BLUE = 'Blue',
  WHITE = 'White',
  PURPLE = 'Purple',
  BROWN = 'Brown',
  BLACK = 'Black',
  RED = 'Red',
  CORAL = 'Coral',
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
}

const collectionId = 'f96b35de-09a2-4b3a-bb26-264549d01407';
export const useGetAthlete = (id: string) => {
  const axios = useAxios(W3blockAPI.KEY);
  const { companyId } = useCompanyConfig();
  const filter = { athleteIdentification: Number(id) };

  return useQuery(
    [PixwayAPIRoutes.METADATA_BY_COLLECTION_ID, collectionId, companyId, id],
    () =>
      axios
        .get(
          PixwayAPIRoutes.METADATA_BY_COLLECTION_ID.replace(
            '{companyId}',
            companyId
          ).replace('{collectionId}', collectionId) +
            `?metadataFilter=${encodeURI(JSON.stringify(filter))}&limit=30`
        )
        .then(
          (data): { items: MetadataApiInterface<AthleteInterface>[] } =>
            data.data
        ),
    {
      enabled: id != undefined && id != '',
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
