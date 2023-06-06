import blackBelt from '../assets/black_belt.png';
import blueBelt from '../assets/blue_belt.png';
import brownBelt from '../assets/brown_belt.png';
import coralBelt from '../assets/coral_belt.png';
import purpleBelt from '../assets/purple_belt.png';
import redBelt from '../assets/red_belt.png';
import Logo from '../assets/WJJC.png';
import {
  AthleteInterface,
  BeltColor,
  useGetAthlete,
} from '../hooks/useGetAthlete';
interface AthletePageProps {
  id: string;
}
export const AthletePage = ({ id }: AthletePageProps) => {
  const { data } = useGetAthlete(id);
  const belts = [
    BeltColor.BLUE,
    BeltColor.PURPLE,
    BeltColor.BROWN,
    BeltColor.BLACK,
    BeltColor.RED,
    BeltColor.CORAL,
  ];
  const getBeltImage = (belt: BeltColor) => {
    switch (belt) {
      case BeltColor.BLUE:
        return blueBelt;
      case BeltColor.PURPLE:
        return purpleBelt;
      case BeltColor.BROWN:
        return brownBelt;
      case BeltColor.BLACK:
        return blackBelt;
      case BeltColor.RED:
        return redBelt;
      case BeltColor.CORAL:
        return coralBelt;
    }
  };

  const getZIndexNumberByIndex = (index: number) => {
    switch (index) {
      case 0:
        return 6;
      case 1:
        return 5;
      case 2:
        return 4;
      case 3:
        return 3;
      case 4:
        return 2;
      case 5:
        return 1;
    }
  };

  const getPlaceholder = (): AthleteInterface => {
    if (id == '000') {
      return {
        athleteIdentification: 0,
        athleteName: 'João Neto',
        athleteBirthdate: 'January 1, 2000',
        athleteGender: 'male',
        beltColor: BeltColor.BLACK,
        graduationDate: 'January 1, 2020',
        graduationAcademy: 'WJJC',
        graduationTeacher: 'João Neto',
        athleteNationality: 'Brazilian',
      };
    } else {
      return {
        athleteIdentification: 0,
        athleteName: '',
        athleteBirthdate: '',
        athleteGender: '',
        beltColor: BeltColor.BLACK,
        graduationDate: '',
        graduationAcademy: '',
        graduationTeacher: '',
        athleteNationality: '',
      };
    }
  };

  return (
    <div className="pw-bg-[#fffefb]">
      <div className="pw-container pw-mx-auto">
        <div className="pw-px-4 pw-flex pw-justify-center pw-items-center pw-flex-col pw-pt-[30px] pw-pb-[60px]">
          <img className="pw-object-contain" src={Logo} alt="WJJC Logo" />
          <div className="pw-flex pw-justify-center pw-gap-2 pw-items-center">
            <div className="pw-w-[120px] pw-h-[2px] pw-bg-black pw-mt-2"></div>
            <p className="pw-text-[40px] pw-font-[700] pw-font-['EB_Garamond'] pw-text-black">
              Certificate
            </p>
            <div className="pw-w-[120px] pw-h-[2px] pw-bg-black"></div>
          </div>
          <img
            className=" pw-w-full sm:pw-w-[350px] sm:pw-h-[350px] pw-rounded-lg pw-object-cover pw-object-center pw-mt-[45px]"
            src={data?.items[0]?.mainImage ?? 'https://placehold.co/600x400'}
            alt={data?.items[0]?.name}
          />
          <p className="pw-text-center pw-text-black pw-font-[700] pw-mt-3 pw-text-[20px]">
            {data?.items[0]?.tokenData?.athleteName ??
              getPlaceholder().athleteName}
          </p>
          <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
            {data?.items[0]?.tokenData?.athleteBirthdate ??
              getPlaceholder().athleteBirthdate}
          </p>
          <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
            {data?.items[0]?.tokenData?.athleteGender ??
              getPlaceholder().athleteGender}
          </p>
          <p className="pw-text-center pw-text-black pw-font-[500] pw-mt-2 pw-text-[16px]">
            {data?.items[0]?.tokenData?.athleteNationality ??
              getPlaceholder().athleteNationality}
          </p>
          <div className="pw-mt-[60px]">
            {belts.map((belt, index) => {
              const respectiveToken = data?.items.find(
                (item) => item.tokenData?.beltColor === belt
              );
              const hasNextBelt = data?.items.find(
                (item) => item.tokenData?.beltColor === belts[index + 1]
              );
              return (
                <div
                  key={belt}
                  style={{ zIndex: getZIndexNumberByIndex(index) }}
                  className="pw-flex pw-items-start pw-gap-8 pw-relative"
                >
                  <div className="pw-flex-1 pw-justify-end">
                    <img
                      className=" pw-w-[150px] sm:pw-w-[200px] pw-object-contain"
                      src={getBeltImage(belt)}
                      alt={respectiveToken?.name ?? belt}
                    />
                  </div>

                  <div className="pw-flex pw-flex-col pw-items-center pw-justify-center">
                    <div className="pw-w-[27px] pw-h-[27px] pw-rounded-full pw-border pw-border-slate-300 pw-bg-white pw-flex pw-items-center pw-justify-center">
                      {respectiveToken != null && (
                        <div className="pw-w-[17px] pw-h-[17px] pw-rounded-full pw-bg-[#01C458]"></div>
                      )}
                    </div>
                    {index < belts.length - 1 && (
                      <div className="pw-h-[200px] pw-w-[8px] pw-flex pw-items-center pw-justify-center pw-border pw-bg-white">
                        {hasNextBelt != null && (
                          <div className="pw-h-[230px] pw-w-[6px] pw-rounded-full pw-bg-[#01C458]"></div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pw-flex-1">
                    {respectiveToken != null && (
                      <>
                        <p className="pw-text-[16px] pw-font-[700] pw-text-black ">
                          {respectiveToken.tokenData.graduationTeacher}
                        </p>
                        <p className="pw-text-[14px] pw-font-[600] pw-text-black ">
                          {respectiveToken.tokenData.graduationAcademy}
                        </p>
                        <p className="pw-text-[12px] pw-font-[500] pw-text-black ">
                          {respectiveToken.tokenData.graduationDate}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
