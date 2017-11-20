import escapeHtml from 'escape-html';
import { isExternalUrl } from '../utils/misc';
import { has } from '../utils/data';
import { list as tlds } from '../../../vendor/tlds';

const PUNCTUATION = '([\\s-.,\'":;!?]+)';

export const SHORTENED_STRING_TOKEN = '…';

export const REGEX_KNOWN_DOMAIN = new RegExp(`\\.(${tlds.join('|')})$`);
export const REGEX_EMAIL_SIGN = /^@/;
export const REGEX_URL_PREFIX = /^(https?:\/\/)/;

export const REGEX_PUNCTUATION_BEGINNING = new RegExp(`^${PUNCTUATION}`);
export const REGEX_PUNCTUATION_ENDING = new RegExp(`${PUNCTUATION}$`);

export const isDomainOk = (domain) => REGEX_KNOWN_DOMAIN.test(domain);
export const isEmail = (text) => REGEX_EMAIL_SIGN.test(text);

export const getLastNode = (ast) => {
  if (!Array.isArray(ast)) return null;
  const last = ast[ast.length - 1];
  if (Array.isArray(last)) return getLastNode(last);
  return last;
};

export const getUrlPrefix = (text) => {
  const matches = REGEX_URL_PREFIX.exec(text);
  if (!matches) return null;
  return matches[1];
};

export const getBeginningPunctuation = (text) => {
  const matches = REGEX_PUNCTUATION_BEGINNING.exec(text);
  if (!matches) return null;
  return matches[1];
};

export const getEndingPunctuation = (text) => {
  const matches = REGEX_PUNCTUATION_ENDING.exec(text);
  if (!matches) return null;
  return matches[1];
};

export const tag = (tagName, tagAttributes, content) => {
  const attributes = tagAttributes || {};
  const attributesArray = Object.keys(attributes).map((key) => {
    let name = key;
    const value = attributes[key];

    if (name === 'className') name = 'class';
    if (typeof value === 'boolean' && value) return name;

    return `${name}="${value}"`;
  });

  let tagParts = ['<', tagName];
  if (attributesArray.length) tagParts.push(` ${attributesArray.join(' ')}`);
  const tagTail = ['>', content, '</', tagName, '>'];

  if (content) {
    tagParts = tagParts.concat(tagTail);
  } else {
    tagParts.push(' />');
  }

  return tagParts.join('');
};

export const linkTag = (href, content) => {
  const attributes = { href };

  if (isExternalUrl(href)) {
    Object.assign(attributes, { target: '_blank', rel: 'noopener noreferrer nofollow' });
  }

  return tag('a', attributes, content);
};

export const injectOrder = (rules, base = 0) => {
  if (!rules) return null;
  let index = base;

  return Object.keys(rules).reduce((result, key) => {
    result[key] = { ...rules[key] };
    if (!has(rules[key], 'order')) result[key].order = index;
    index += 1;
    return result;
  }, {});
};

export const proxyMatch = (matches) => ({ content: matches[0] });
export const safeContent = ({ content }) => escapeHtml(content);
export const emptyShorten = () => SHORTENED_STRING_TOKEN;
