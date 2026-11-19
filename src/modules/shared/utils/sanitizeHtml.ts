import DOMPurify from 'dompurify';

const ALLOWED_EMBED_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
]);

/**
 * Only `https:` URLs pointing at the YouTube / Vimeo players are accepted as
 * `<iframe src>` in rich-text content.
 */
export const isAllowedEmbedSrc = (src?: string): boolean => {
  if (!src) return false;
  try {
    const url = new URL(src.trim());
    return url.protocol === 'https:' && ALLOWED_EMBED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

const CONTAINER_DANGEROUS_TAGS = ['script', 'style', 'object', 'applet'];
const VOID_DANGEROUS_TAGS = ['meta', 'link', 'base', 'embed'];

const containerTagRegex = (tag: string) =>
  new RegExp(
    `<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>|<${tag}\\b[^>]*\\/?>`,
    'gi'
  );
const voidTagRegex = (tag: string) =>
  new RegExp(`<${tag}\\b[^>]*\\/?>(?:<\\/${tag}\\s*>)?`, 'gi');

const IFRAME_REGEX =
  /<iframe\b([^>]*)>[\s\S]*?<\/iframe\s*>|<iframe\b([^>]*)\/?>/gi;
const SRC_ATTR_REGEX = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;

const EVENT_HANDLER_ATTR_REGEX =
  /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)/gi;

const URL_ATTR_REGEX =
  /(\s+(?:href|src|xlink:href|formaction)\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;

const decodeUrlValue = (value: string): string =>
  value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&#(\d+);?/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&tab;|&newline;/gi, '')
    .replace(/[\u0000- ]/g, '')
    .toLowerCase();

const isDangerousUrl = (value: string): boolean => {
  const decoded = decodeUrlValue(value);
  if (decoded.startsWith('javascript:') || decoded.startsWith('vbscript:')) {
    return true;
  }
  return decoded.startsWith('data:') && !decoded.startsWith('data:image/');
};

/**
 * Regex-based fallback used where no DOM is available (SSR). It is purposely
 * conservative: it removes the elements and attributes that can execute code
 * and leaves everything else untouched, without re-serialising the markup.
 */
export const stripDangerousHtml = (html: string): string => {
  let output = html;

  for (const tag of CONTAINER_DANGEROUS_TAGS) {
    output = output.replace(containerTagRegex(tag), '');
  }
  for (const tag of VOID_DANGEROUS_TAGS) {
    output = output.replace(voidTagRegex(tag), '');
  }

  output = output.replace(IFRAME_REGEX, (match, attrsA, attrsB) => {
    const attrs: string = attrsA ?? attrsB ?? '';
    const srcMatch = SRC_ATTR_REGEX.exec(attrs);
    const src = srcMatch
      ? srcMatch[1] ?? srcMatch[2] ?? srcMatch[3]
      : undefined;
    return isAllowedEmbedSrc(src) ? match : '';
  });

  output = output.replace(EVENT_HANDLER_ATTR_REGEX, '');

  output = output.replace(URL_ATTR_REGEX, (match, prefix, dq, sq, bare) => {
    const value: string = dq ?? sq ?? bare ?? '';
    return isDangerousUrl(value) ? `${prefix}""` : match;
  });

  return output;
};

let hooksRegistered = false;

const registerHooks = () => {
  if (hooksRegistered) return;
  hooksRegistered = true;

  DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe') {
      const src = (node as Element).getAttribute?.('src') ?? undefined;
      if (!isAllowedEmbedSrc(src)) {
        node.parentNode?.removeChild(node);
      }
    }
  });

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

/**
 * Sanitises tenant-authored / CMS rich text before it reaches
 * `dangerouslySetInnerHTML`.
 *
 * In the browser DOMPurify does the work. During SSR there is no DOM, so the
 * regex fallback (`stripDangerousHtml`) runs instead. Both paths must be safe
 * on their own: React does not patch `innerHTML` on hydration, so markup
 * emitted by the server stays in the page as-is until the component
 * re-renders.
 */
export const sanitizeHtml = (html?: string | null): string => {
  if (!html) return '';

  if (typeof window !== 'undefined' && DOMPurify.isSupported) {
    registerHooks();
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder'],
    });
  }

  return stripDangerousHtml(html);
};
