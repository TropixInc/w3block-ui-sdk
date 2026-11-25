import Skeleton from './Skeleton';

interface Props {
  /** Formatted date the account was created; undefined while the profile loads. */
  memberSince?: string | null;
  /** Translated "Member since" label. */
  label: string;
}

/**
 * Footer of the internal menu. It is a block container, never a <p>: the
 * skeleton is a <div>, and a <div> inside a <p> is invalid HTML. The browser
 * closes the <p> early while parsing the server HTML, React then fails
 * hydration and re-renders the whole page from its nearest Suspense fallback,
 * which shows as a "Loading..." flash on every private route.
 */
export const MenuFooter = ({ memberSince, label }: Props) => (
  <div className="pw-mt-3 pw-pt-3 pw-px-2 pw-border-t pw-border-[#E6E8EC] pw-text-[11px] pw-text-[#8B93A3]">
    {memberSince ? (
      `${label} ${memberSince}`
    ) : (
      <Skeleton className="pw-h-2.5 pw-w-28 pw-rounded" />
    )}
  </div>
);
