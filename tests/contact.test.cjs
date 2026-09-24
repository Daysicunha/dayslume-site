// Behavioral checks with a minimal DOM fixture. No network request or message is sent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/dayslume-contact.js'), 'utf8');
function setup() {
  const listeners = {};
  const fields = ['nome', 'email', 'empresa', 'necessidade'].map(name => ({
    name, value: '', required: name !== 'empresa', minLength: name === 'necessidade' ? 10 : -1,
    disabled: true, error: '', setCustomValidity(message) { this.error = message; }
  }));
  const status = { textContent: '' };
  const link = { hidden: true, focus() { this.focused = true; }, removeAttribute(name) { delete this[name]; } };
  const button = { type: 'button', disabled: true };
  const form = {
    hidden: true, dataset: { whatsapp: '5531994492474' },
    elements: { namedItem: name => fields.find(field => field.name === name) },
    querySelector: selector => ({ '#form-status': status, '#whatsapp-submit': link, button })[selector],
    querySelectorAll: () => fields,
    addEventListener: (name, handler) => { listeners[name] = handler; },
    reportValidity: () => fields.every(field => !field.error)
  };
  vm.runInNewContext(source, { document: { querySelector: () => form } });
  const fill = values => fields.forEach(field => { field.value = values[field.name] || ''; });
  const submit = () => {
    let prevented = false;
    listeners.submit({ preventDefault() { prevented = true; } });
    assert.equal(prevented, true, 'No native form navigation');
  };
  return { form, fields, button, link, status, listeners, fill, submit };
}
test('Form enables after initialization; accented text cannot inject URL parameters', () => {
  const f = setup();
  assert.equal(f.form.hidden, false);
  assert.equal(f.button.disabled, false);
  f.fill({ nome: '  João & Ana  ', email: 'joao@example.com', empresa: 'A+B', necessidade: 'Site com catálogo & itens? #teste' });
  f.submit();
  const url = new URL(f.link.href);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5531994492474');
  assert.deepEqual([...url.searchParams.keys()], ['text']);
  assert.match(url.searchParams.get('text'), /Nome: João & Ana\n/);
  assert.match(url.searchParams.get('text'), /Site com catálogo & itens\? #teste/);
  assert.equal(f.link.hidden, false);
  assert.equal(f.link.focused, true);
  assert.match(f.status.textContent, /revisar e enviar/);
});
test('Blank names and whitespace-only descriptions never produce a contact link', () => {
  const f = setup();
  f.fill({ nome: '   ', email: 'a@example.com', necessidade: '             ' });
  f.submit();
  assert.equal(f.link.href, undefined);
  assert.equal(f.link.hidden, true);
  assert.ok(f.fields.find(x => x.name === 'nome').error);
  assert.ok(f.fields.find(x => x.name === 'necessidade').error);
});
test('Editing or resetting removes the prepared message and its personal data', () => {
  const f = setup();
  f.fill({ nome: 'Teste', email: 'teste@example.com', necessidade: 'Solicitação de exemplo' });
  f.submit();
  f.listeners.input({ target: f.fields[0] });
  assert.equal(f.link.hidden, true);
  assert.equal(f.link.href, undefined);
  f.submit();
  f.listeners.reset();
  assert.equal(f.link.hidden, true);
  assert.equal(f.link.href, undefined);
});
