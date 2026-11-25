import { KeyboardEvent, MouseEvent, ReactNode } from 'react';

interface Props {
  /** Where the whole slide leads; undefined makes it a plain container. */
  href?: string;
  children: ReactNode;
}

/**
 * Makes a whole banner slide act as a link while the call-to-action buttons
 * inside it stay real <a> elements. The slide used to be an <a> itself, but
 * an <a> cannot contain another <a>: the browser splits the markup while
 * parsing the server HTML, React fails hydration and regenerates the page
 * from its nearest Suspense fallback (a "Loading..." flash on the home).
 *
 * Clicks on the inner anchors and buttons keep their own target. Any other
 * click navigates to `href` unless something (Swiper after a drag) cancelled
 * the event, which mirrors the default action of the old <a>.
 */
export const BannerLinkArea = ({ href, children }: Props) => {
  if (!href) return <div>{children}</div>;

  const go = () => window.location.assign(href);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    const native = event.nativeEvent;
    // Decide after the event finished bubbling, so a preventDefault() from an
    // ancestor (Swiper's preventClicks) still cancels the navigation.
    setTimeout(() => {
      if (!native.defaultPrevented) go();
    }, 0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      go();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      className="pw-cursor-pointer"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};
