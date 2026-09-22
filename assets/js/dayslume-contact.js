/* Local preparation only: opening WhatsApp is an explicit visitor action. */
(() => {
  'use strict';
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = form.querySelector('#form-status');
  const continuation = form.querySelector('#whatsapp-submit');
  const fields = [...form.querySelectorAll('input, textarea')];
  const submit = form.querySelector('button');
  const clearMessage = () => {
    continuation.hidden = true;
    continuation.removeAttribute('href');
  };
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearMessage();
    fields.forEach(field => {
      const value = field.value.trim();
      field.setCustomValidity(field.required && !value
        ? 'Preencha este campo.'
        : field.minLength > 0 && value.length < field.minLength
          ? `Escreva pelo menos ${field.minLength} caracteres, além dos espaços nas extremidades.`
          : '');
    });
    if (!form.reportValidity()) return;
    const value = name => form.elements.namedItem(name).value.trim();
    const lines = ['Olá! Vim pelo site da DAYSLUME.', '', `Nome: ${value('nome')}`, `E-mail: ${value('email')}`];
    if (value('empresa')) lines.push(`Empresa/projeto: ${value('empresa')}`);
    lines.push('', `Gostaria de conversar sobre: ${value('necessidade')}`);
    continuation.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    continuation.hidden = false;
    status.textContent = 'Mensagem preparada. Continue no WhatsApp para revisar e enviar.';
    continuation.focus();
  });
  form.addEventListener('input', event => {
    event.target.setCustomValidity?.('');
    if (!continuation.hidden) {
      clearMessage();
      status.textContent = 'Você alterou os dados. Prepare a solicitação novamente.';
    }
  });
  form.addEventListener('reset', () => {
    fields.forEach(field => field.setCustomValidity(''));
    clearMessage();
    status.textContent = 'Preencha os campos para preparar sua mensagem.';
  });
  // Enable only after interception is installed. Without JS, use the direct link.
  fields.forEach(field => { field.disabled = false; });
  submit.type = 'submit';
  submit.disabled = false;
  form.hidden = false;
})();
