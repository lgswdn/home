// Data-driven rendering of Jon Barron's adapted paper-row markup.
import { load } from './vendor/js-yaml.mjs';

const body = document.querySelector('#papers');
const status = document.querySelector('#papers-status');

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function safeUrl(value) {
  if (typeof value !== 'string') throw new Error('Links and image paths must be text.');
  const url = new URL(value, document.baseURI);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Use an HTTP/HTTPS link or a local image path.');
  return url.href;
}
function link(text, url) {
  const element = node('a', text);
  element.href = safeUrl(url);
  return element;
}
function checkPaper(paper, ids) {
  if (!paper || typeof paper !== 'object') throw new Error('Each paper must be an entry beginning with a dash.');
  for (const key of ['id', 'title', 'venue']) {
    if (typeof paper[key] !== 'string' || !paper[key].trim()) throw new Error(`A paper needs a text ${key}.`);
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(paper.id) || ids.has(paper.id)) throw new Error('Give each paper a unique id, such as lda-1b.');
  ids.add(paper.id);
  if (!Array.isArray(paper.authors) || !paper.authors.length || !paper.authors.every(a => typeof a === 'string')) throw new Error(`${paper.id}: authors must be a list of names.`);
  if (!Number.isInteger(paper.year) || paper.year < 1900 || paper.year > 2200) throw new Error(`${paper.id}: use a four-digit numeric year.`);
  if (paper.highlighted !== undefined && typeof paper.highlighted !== 'boolean') throw new Error(`${paper.id}: highlighted must be true or false.`);
  for (const key of ['links', 'author_links']) {
    if (paper[key] !== undefined && (!paper[key] || typeof paper[key] !== 'object' || Array.isArray(paper[key]))) throw new Error(`${paper.id}: ${key} must be a label-to-URL mapping.`);
  }
  for (const key of ['image', 'image_alt', 'description']) {
    if (paper[key] !== undefined && typeof paper[key] !== 'string') throw new Error(`${paper.id}: ${key} must be text.`);
  }
}
function row(paper, ownName) {
  const tr = node('tr');
  tr.id = paper.id;
  if (paper.highlighted) tr.className = 'highlight';
  const figure = node('td', undefined, 'paper-image');
  const frame = node('div', undefined, 'one');
  const img = node('img');
  img.src = safeUrl(paper.image || 'assets/paper-placeholder.svg');
  img.alt = paper.image_alt || `Research figure for ${paper.title}`;
  img.width = img.height = 160;
  img.loading = 'lazy';
  frame.append(img); figure.append(frame);
  const info = node('td', undefined, 'paper-info');
  const title = node('span', paper.title, 'papertitle');
  const urls = paper.links || {};
  const primary = urls['project page'] || urls.paper || urls.arXiv || Object.values(urls)[0];
  if (primary) { const a = link('', primary); a.append(title); info.append(a); }
  else info.append(title);
  info.append(node('br'));
  paper.authors.forEach((author, index) => {
    if (index) info.append(document.createTextNode(', '));
    const name = author.replace(/\*+$/, '').trim();
    let label = name === ownName ? node('strong', author) : node('span', author);
    if (paper.author_links?.[name]) { const a = link('', paper.author_links[name]); a.append(label); label = a; }
    info.append(label);
  });
  const venue = node('em');
  const abbreviation = paper.venue.match(/^(.*?)(\([A-Z][A-Z0-9 -]*\))$/);
  if (abbreviation) {
    venue.append(document.createTextNode(abbreviation[1]), node('strong', abbreviation[2]));
  } else {
    venue.textContent = paper.venue;
  }
  info.append(node('br'), venue, document.createTextNode(`, ${paper.year}`));
  const entries = Object.entries(urls);
  if (entries.length) info.append(node('br'));
  entries.forEach(([label, url], index) => {
    if (index) info.append(document.createTextNode(' / '));
    info.append(link(label, url));
  });
  if (paper.description) info.append(node('p', paper.description));
  tr.append(figure, info);
  return tr;
}

async function render() {
  try {
    const response = await fetch('papers.yml', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load papers.yml.');
    const data = load(await response.text());
    if (!data || !Array.isArray(data.papers)) throw new Error('papers.yml needs a papers: list.');
    const ids = new Set();
    const fragment = document.createDocumentFragment();
    for (const paper of data.papers) {
      checkPaper(paper, ids);
      fragment.append(row(paper, data.own_name || ''));
    }
    body.replaceChildren(fragment);
    status.textContent = data.papers.length ? '' : 'No publications listed yet.';
    status.hidden = Boolean(data.papers.length);
  } catch (error) {
    status.hidden = false;
    status.setAttribute('role', 'alert');
    status.textContent = `Unable to display papers. Check papers.yml: ${error.message}`;
    console.error(error);
  }
}
render();
