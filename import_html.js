javascript: (async () => {
  /* Copyright 2024 Yawar Amin

     This file is part of dream-html.

     dream-html is free software: you can redistribute it and/or modify it
     under the terms of the GNU General Public License as published by the Free
     Software Foundation, either version 3 of the License, or (at your option) any
     later version.

     dream-html is distributed in the hope that it will be useful, but
     WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
     FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
     details.

     You should have received a copy of the GNU General Public License along with
     dream-html. If not, see <https://www.gnu.org/licenses/>. */

  const suffixAttrs = [
    'cite', 'class', 'data', 'for', 'form', 'label', 'method', 'object', 'open',
    'slot', 'span', 'style', 'title', 'type',
  ];
  const ariaAttrs = [
    'aria-activedescendant', 'aria-atomic', 'aria-autocomplete',
    'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy',
    'aria-checked', 'aria-colcount', 'aria-colindextext', 'aria-colspan',
    'aria-controls', 'aria-current', 'aria-describedby', 'aria-description',
    'aria-details', 'aria-disabled', 'aria-errormessage', 'aria-expanded',
    'aria-flowto', 'aria-haspopup', 'aria-hidden', 'aria-invalid',
    'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level',
    'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable',
    'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset',
    'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required',
    'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowindextext',
    'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax',
    'aria-valuemin', 'aria-valuenow', 'aria-valuetext',
  ];
  const hxAttrs = [
    'hx-boost', 'hx-confirm', 'hx-delete', 'hx-disable', 'hx-disinherit',
    'hx-encoding', 'hx-ext', 'hx-get', 'hx-headers', 'hx-history',
    'hx-history-elt', 'hx-include', 'hx-indicator', 'hx-on', 'hx-params',
    'hx-patch', 'hx-post', 'hx-preload', 'hx-preserve', 'hx-prompt',
    'hx-push-url', 'hx-put', 'hx-replace-url', 'hx-request', 'hx-select',
    'hx-select-oob', 'hx-sse-connect', 'hx-sse-swap', 'hx-swap', 'hx-swap-oob',
    'hx-sync', 'hx-target', 'hx-trigger', 'hx-validate', 'hx-vals',
    'hx-ws-connect', 'hx-ws-send',
  ];
  const polyVarAttrs = [
    'autocapitalize', 'autocomplete', 'capture', 'crossorigin', 'decoding', 'dir',
    'enctype', 'fetchpriority', 'formenctype', 'formmethod', 'hidden',
    'http_equiv', 'inputmode', 'kind', 'low', 'method', 'preload',
    'referrerpolicy', 'role', 'translate', 'wrap',
  ];
  const intAttrs = [
    'cols', 'colspan', 'maxlength', 'minlength', 'rows', 'rowspan', 'span',
    'start', 'tabindex',
  ];
  const boolAttrs = [
    'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer',
    'disabled', 'draggable', 'formnovalidate', 'ismap', 'loop', 'multiple',
    'muted', 'novalidate', 'open', 'playsinline', 'readonly', 'required',
    'reversed', 'selected',
  ];
  const voidTags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
    'source', 'track', 'wbr',
  ];
  const textTags = ['option', 'script', 'style', 'textarea', 'title'];

  const attr = name => {
    if (suffixAttrs.indexOf(name) > -1) return name + '_';
    if (ariaAttrs.indexOf(name) > -1) return 'Aria.' + name.slice(5);
    if (hxAttrs.indexOf(name) > -1) return 'Hx.' + name.slice(3).replaceAll('-', '_');

    if (
      name.length >= 9 &&
      name.startsWith('data-hx-') &&
      hxAttrs.indexOf(name.slice(5)) > -1
    ) return 'Hx.' + name.slice(8).replaceAll('-', '_');

    if (name.indexOf('-') > -1) return 'string_attr "' + name + '"';
    return name;
  };

  const polyvar = v =>
    '`' + (v == 'get' || v == 'post' ? v.toUpperCase() : v).replaceAll('-', '_');

  const stringify = (v, nm = '') => {
    if (v == null) return '';
    if (polyVarAttrs.indexOf(nm) > -1) return polyvar(v);
    if (intAttrs.indexOf(nm) > -1) return v;
    if (boolAttrs.indexOf(nm) > -1) return '';
    if (v.indexOf('"') > -1) return '{|' + v + '|}';
    return '"' + v + '"';
  };

  let res = '';

  const writeTag = t => {
    switch (t.nodeType) {
      case Node.COMMENT_NODE:
        res += 'comment ';
        res += stringify(t.data);
        break;

      case Node.TEXT_NODE:
        res += 'txt ';
        res += stringify(t.data);
        break;

      case Node.ELEMENT_NODE:
        const name = t.tagName.toLowerCase();
        res += name;

        res += ' [';
        for (const a of t.attributes) {
          res += attr(a.name);
          res += ' ';
          res += stringify(a.value, a.name);
          res += '; ';
        }
        res += '] ';

        if (voidTags.indexOf(name) > -1) {
          /* do nothing */
        } else if (textTags.indexOf(name) > -1) {
          res += stringify(t.innerText);
        } else {
          res += '[';
          for (const child of t.childNodes) {
            res += '\n';
            writeTag(child);
            res += ';';
          }
          res += ']';
        }
        break;

      default:
        console.warn(t.nodeType);
    }
  };

  writeTag(document.querySelector('html'));
  await navigator.clipboard.writeText(res);
})()