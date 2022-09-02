import { usePixwaySession } from '../../hooks/usePixwaySession';

interface UserTagProps {
  className?: string;
  onClick?: () => void;
}

export const UserTag = ({ className, onClick }: UserTagProps) => {
  const { data: session } = usePixwaySession();
  return (
    <div
      onClick={onClick}
      className={`pw-rounded-full pw-flex pw-justify-center pw-items-center pw-w-[30px] pw-h-[30px] pw-bg-[#EFEFEF] pw-border-2 pw-border-[#353945
      ]  ${className}`}
    >
      {session ? session.user?.name?.charAt(0) : ''}
    </div>
  );
};
