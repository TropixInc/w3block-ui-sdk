import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isAllowedEmbedSrc,
  sanitizeHtml,
  stripDangerousHtml,
} from './sanitizeHtml';

describe('isAllowedEmbedSrc', () => {
  it('accepts only https YouTube / Vimeo player URLs', () => {
    assert.ok(isAllowedEmbedSrc('https://www.youtube.com/embed/abc'));
    assert.ok(isAllowedEmbedSrc('https://youtube.com/embed/abc'));
    assert.ok(isAllowedEmbedSrc('https://www.youtube-nocookie.com/embed/abc'));
    assert.ok(isAllowedEmbedSrc('https://player.vimeo.com/video/123'));
  });

  it('rejects other hosts, http, and malformed values', () => {
    assert.equal(isAllowedEmbedSrc('http://www.youtube.com/embed/abc'), false);
    assert.equal(isAllowedEmbedSrc('https://evil.com/embed'), false);
    assert.equal(
      isAllowedEmbedSrc('https://www.youtube.com.evil.com/embed'),
      false
    );
    assert.equal(isAllowedEmbedSrc('javascript:alert(1)'), false);
    assert.equal(isAllowedEmbedSrc('not a url'), false);
    assert.equal(isAllowedEmbedSrc(''), false);
    assert.equal(isAllowedEmbedSrc(undefined), false);
  });
});

describe('sanitizeHtml (SSR fallback path)', () => {
  it('returns an empty string for null / undefined / empty input', () => {
    assert.equal(sanitizeHtml(null), '');
    assert.equal(sanitizeHtml(undefined), '');
    assert.equal(sanitizeHtml(''), '');
  });

  it('removes script elements and their content', () => {
    assert.equal(
      sanitizeHtml('<p>hi</p><script>alert(1)</script><p>bye</p>'),
      '<p>hi</p><p>bye</p>'
    );
    assert.equal(
      sanitizeHtml('<p>x</p><SCRIPT src="https://e.com/x.js"></SCRIPT>'),
      '<p>x</p>'
    );
  });

  it('removes style, object, embed, meta, link and base elements', () => {
    const out = sanitizeHtml(
      '<style>body{}</style><object data="x"></object><embed src="x">' +
        '<meta http-equiv="refresh" content="0"><link rel="stylesheet" href="x">' +
        '<base href="https://evil.com/"><p>ok</p>'
    );
    assert.equal(out, '<p>ok</p>');
  });

  it('strips inline event handlers in every quoting style', () => {
    assert.equal(
      sanitizeHtml('<img src="https://a.com/a.png" onerror="alert(1)">'),
      '<img src="https://a.com/a.png">'
    );
    assert.equal(
      sanitizeHtml('<div onclick=\'alert(1)\' class="x">t</div>'),
      '<div class="x">t</div>'
    );
    assert.equal(
      sanitizeHtml('<div onmouseover=alert(1)>t</div>'),
      '<div>t</div>'
    );
  });

  it('neutralises javascript:, vbscript: and non-image data: URLs', () => {
    assert.equal(
      sanitizeHtml('<a href="javascript:alert(1)">x</a>'),
      '<a href="">x</a>'
    );
    assert.equal(
      sanitizeHtml('<a href=" JaVaScRiPt:alert(1)">x</a>'),
      '<a href="">x</a>'
    );
    assert.equal(
      sanitizeHtml('<a href="java&#x09;script:alert(1)">x</a>'),
      '<a href="">x</a>'
    );
    assert.equal(
      sanitizeHtml('<a href="vbscript:msgbox(1)">x</a>'),
      '<a href="">x</a>'
    );
    assert.equal(
      sanitizeHtml('<a href="data:text/html;base64,AAAA">x</a>'),
      '<a href="">x</a>'
    );
    assert.equal(
      sanitizeHtml(
        '<form action="x"><button formaction="javascript:1">b</button></form>'
      ),
      '<form action="x"><button formaction="">b</button></form>'
    );
  });

  it('keeps data:image/ sources', () => {
    const html = '<img src="data:image/png;base64,iVBORw0KGgo=">';
    assert.equal(sanitizeHtml(html), html);
  });

  it('removes iframes whose src is not an allowed embed', () => {
    assert.equal(
      sanitizeHtml(
        '<p>a</p><iframe src="https://evil.com/x"></iframe><p>b</p>'
      ),
      '<p>a</p><p>b</p>'
    );
    assert.equal(
      sanitizeHtml('<iframe srcdoc="<script>1</script>"></iframe>'),
      ''
    );
    assert.equal(sanitizeHtml('<iframe src="https://evil.com/x" />'), '');
  });

  it('keeps YouTube / Vimeo iframes intact', () => {
    const yt =
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/abc" ' +
      'frameborder="0" allow="autoplay" allowfullscreen></iframe>';
    assert.equal(sanitizeHtml(yt), yt);
    const vimeo = "<iframe src='https://player.vimeo.com/video/1'></iframe>";
    assert.equal(sanitizeHtml(vimeo), vimeo);
  });

  it('leaves ordinary rich text untouched', () => {
    const html =
      '<p>Olá <b>mundo</b><br>' +
      '<a href="https://w3block.io" target="_blank">link</a> ' +
      '<img src="https://cdn.w3block.io/a.png" alt="a"></p>' +
      '<ul><li style="color: red">item</li></ul>';
    assert.equal(sanitizeHtml(html), html);
  });

  it('exposes the fallback directly', () => {
    assert.equal(stripDangerousHtml('<b>x</b><script></script>'), '<b>x</b>');
  });
});
