import { usePixwaySession } from '../../hooks/usePixwaySession';

interface UserTagProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const UserTag = ({ size = 30, className, onClick }: UserTagProps) => {
  const { data: session } = usePixwaySession();
  return (
    <div
      onClick={onClick}
      style={{ width: size + 'px', height: size + 'px' }}
      className={`pw-rounded-full pw-flex pw-justify-center pw-items-center pw-bg-[#EFEFEF] pw-border-2 pw-border-[#353945
      ]  ${className}`}
    >
      {session ? session.user?.name?.charAt(0) : ''}
    </div>
  );
};
