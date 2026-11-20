const switcher = document.querySelector('#language');
const notice = document.querySelector('#notice');
const copy = Array.from(document.querySelectorAll('[data-es]'), element => [element, element.textContent]);
let spanish = new URLSearchParams(location.search).get('lang') === 'es';

function openLinksInNewWindow() {
  for (const link of document.querySelectorAll('a[href]')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
}

function render() {
  document.documentElement.lang = spanish ? 'es' : 'en';
  document.title = spanish ? 'RWB Revolution | Reparaciones y remodelación' : 'RWB Revolution | Home Repairs & Remodeling';
  switcher.textContent = spanish ? 'English' : 'Español';
  switcher.lang = spanish ? 'en' : 'es';
  notice.textContent = '';
  for (const [element, english] of copy) element.textContent = spanish ? element.dataset.es : english;
  const message = spanish ? 'Hola Wilson, quisiera un estimado gratis para un proyecto en mi hogar.' : 'Hi Wilson, I’d like a free estimate for a home project.';
  for (const link of document.querySelectorAll('[data-wa]')) link.href = `https://wa.me/14698950486?text=${encodeURIComponent(message)}`;
  openLinksInNewWindow();
}

switcher.addEventListener('click', () => {
  spanish = !spanish;
  const url = new URL(location.href);
  if (spanish) url.searchParams.set('lang', 'es');
  else url.searchParams.delete('lang');
  if (location.protocol !== 'file:') history.replaceState(null, '', url);
  render();
});

document.querySelector('#share').addEventListener('click', async () => {
  const url = location.href.split('#')[0];
  try {
    if (navigator.share) await navigator.share({ title: document.title, url });
    else {
      await navigator.clipboard.writeText(url);
      notice.textContent = spanish ? 'Enlace copiado.' : 'Link copied.';
    }
  } catch (error) {
    if (error.name !== 'AbortError') notice.textContent = url;
  }
});

const icons = {
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm9 9a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm1.5-5.5h.01',
  phone: 'M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-2Z',
  chat: 'M20 17a9 9 0 1 0-15-1l-1 5 5-1a9 9 0 0 0 11-3ZM9 8c0 4 3 7 7 7',
  message: 'M4 4h16v12H9l-5 4V4Zm4 5h8m-8 3h5',
  share: 'M12 15V3m-4 4 4-4 4 4M7 10H4v11h16V10h-3',
  facebook: 'M14 21v-8h3l1-4h-4V7c0-1 .5-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8',
};
function addIcon(element, name) {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS(icon.namespaceURI, 'path');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  path.setAttribute('d', icons[name]);
  icon.append(path);
  element.prepend(icon);
}

const facebook = document.createElement('a');
facebook.className = 'btn social';
facebook.target = '_blank';
facebook.rel = 'noopener noreferrer';
facebook.textContent = 'Share on Facebook';
copy.push([facebook, facebook.textContent]);
facebook.dataset.es = 'Compartir en Facebook';
document.querySelector('#share').before(facebook);

function decorate() {
  for (const [selector, name] of [['[data-wa]', 'chat'], ['a[href^="tel:"]', 'phone'], ['a[href^="sms:"]', 'message'], ['#share', 'share'], ['.social', 'facebook']]) {
    for (const element of document.querySelectorAll(selector)) {
      if (!element.querySelector('svg')) addIcon(element, name);
    }
  }
  facebook.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href.split('#')[0]);
}

const theme = document.createElement('link');
theme.rel = 'stylesheet';
theme.href = 'refresh.css';
document.head.append(theme);
render();
decorate();
openLinksInNewWindow();
switcher.addEventListener('click', decorate);

const share = document.querySelector('#share');
const instagram = document.createElement('button');
instagram.type = 'button';
const whatsapp = document.querySelector('.contact [data-wa]').cloneNode(true);
for (const element of [instagram, facebook, whatsapp]) element.classList.add('social-icon');
share.before(instagram, facebook, whatsapp);
addIcon(instagram, 'instagram');
instagram.addEventListener('click', async () => {
  const url = location.href.split('#')[0];
  try {
    await navigator.clipboard.writeText(url);
    notice.textContent = spanish ? 'Enlace copiado para pegar en Instagram.' : 'Link copied to paste on Instagram.';
  } catch {
    notice.textContent = url;
  }
});

const dialog = document.createElement('dialog');
dialog.setAttribute('aria-labelledby', 'service-title');
dialog.innerHTML = '<button type="button" class="close-service">×</button><p class="label"></p><h2 id="service-title"></h2><p class="summary"></p><label for="project-notes"></label><textarea id="project-notes" rows="3"></textarea><a class="btn primary"></a>';
document.body.append(dialog);
const notes = dialog.querySelector('textarea');
const close = dialog.querySelector('button');
const estimate = dialog.querySelector('a');
const title = dialog.querySelector('h2');
function updateEstimate() {
  const start = spanish ? 'Hola Wilson, quisiera un estimado gratis para: ' : 'Hi Wilson, I would like a free estimate for: ';
  estimate.href = 'https://wa.me/14698950486?text=' + encodeURIComponent(start + title.textContent + (notes.value.trim() ? '\n\n' + notes.value.trim() : ''));
  estimate.target = '_blank';
  estimate.rel = 'noopener noreferrer';
}
for (const card of document.querySelectorAll('article')) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'service-open';
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => {
    title.textContent = card.querySelector('h3').textContent;
    dialog.querySelector('.summary').textContent = card.querySelector('p').textContent;
    dialog.querySelector('.label').textContent = spanish ? 'Planea tu proyecto' : 'Plan your project';
    dialog.querySelector('label').textContent = spanish ? 'Cuéntanos qué quieres mejorar (opcional)' : 'Tell us what you want to improve (optional)';
    notes.placeholder = spanish ? 'Ejemplo: Vivo en Mesquite. Quiero renovar mi baño. ¿Podemos agendar un estimado?' : 'Example: I live in Mesquite. I want to update my bathroom. Can we schedule an estimate?';
    notes.value = '';
    close.setAttribute('aria-label', spanish ? 'Cerrar' : 'Close');
    estimate.textContent = spanish ? 'Pedir estimado por WhatsApp' : 'Get a WhatsApp estimate';
    addIcon(estimate, 'chat');
    updateEstimate();
    dialog.showModal();
  });
  card.append(button);
}
close.addEventListener('click', () => dialog.close());
notes.addEventListener('input', updateEstimate);
function localizeExtras() {
  instagram.setAttribute('aria-label', spanish ? 'Copiar enlace para Instagram' : 'Copy link for Instagram');
  facebook.setAttribute('aria-label', spanish ? 'Compartir en Facebook' : 'Share on Facebook');
  whatsapp.setAttribute('aria-label', spanish ? 'Contactar por WhatsApp' : 'Contact on WhatsApp');
  for (const button of document.querySelectorAll('.service-open')) button.textContent = spanish ? 'Explorar servicio' : 'Explore service';
}
switcher.addEventListener('click', localizeExtras);
localizeExtras();
