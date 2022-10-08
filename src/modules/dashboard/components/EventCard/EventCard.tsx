import { Button } from '../Button';

interface EventCardProps {
  id: string;
  eventTitle: string;
  profileTitle: string;
  eventDescription: string;
  url: string;
}

export const EventCard = ({
  eventTitle,
  profileTitle,
  eventDescription,
  url,
}: EventCardProps) => {
  return (
    <div className="pw-w-[270px] pw-h-[240px] pw-shadow-md pw-rounded-b-2xl">
      <div className="pw-bg-brand-primary pw-max-h-10 pw-rounded-t-2xl pw-py-2 pw-px-4 pw-text-white pw-truncate">
        {eventTitle}
      </div>
      <div className="pw-font-poppins pw-p-5 pw-flex pw-flex-col pw-gap-[14px] pw-h-full">
        <p className="pw-font-medium pw-text-lg pw-leading-[23px]">
          {profileTitle}
        </p>
        <p className="pw-font-normal pw-text-sm pw-leading-[21px]">
          {eventDescription}
        </p>
        <Button style="pw-max-w-[110px]" onClick={() => console.log(url)}>
          Veja mais
        </Button>
      </div>
    </div>
  );
};
