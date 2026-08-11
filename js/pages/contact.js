/* Contact page with validated form. */
import { STORE } from '../data/content.js';
import { validate, required, ruleName, ruleEmail, ruleMobile, ruleMessage, isMobile } from '../lib/validate.js';
import { $ } from '../lib/dom.js';
import { icon } from '../components/icons.js';
import { toast } from '../components/toast.js';

export const title = 'Contact — ItsZhop';

export function render() {
  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span><span aria-current="page">Contact</span>
      </nav>
      <h1 style="margin-bottom:var(--space-2)">Contact us</h1>
      <p class="muted" style="margin-bottom:var(--space-6)">A question about an order, a custom crochet request, or pickle advice — we read everything.</p>

      <div class="contact-layout">
        <div class="contact-info">
          <div class="contact-card">${icon('mail', 22)}<div><strong>Email</strong><span>${STORE.email}</span></div></div>
          <div class="contact-card">${icon('phone', 22)}<div><strong>Phone / WhatsApp</strong><span>${STORE.phone} (${STORE.hours})</span></div></div>
          <div class="contact-card">${icon('pin', 22)}<div><strong>Studio</strong><span>${STORE.address}</span></div></div>
          <div class="contact-card">${icon('truck', 22)}<div><strong>Order help</strong><span>Include your order ID (starts with ZHP-) for faster support.</span></div></div>
        </div>

        <form class="checkout-form" data-form="contact" novalidate style="padding:var(--space-5)">
          <div data-contact-success></div>
          <div class="form-grid">
            <div class="field">
              <label for="ct-name">Name <span class="req">*</span></label>
              <input class="input" id="ct-name" name="name" autocomplete="name" placeholder="Your name">
              <p class="field-error" id="cerr-name"></p>
            </div>
            <div class="field">
              <label for="ct-email">Email <span class="req">*</span></label>
              <input class="input" id="ct-email" name="email" type="email" autocomplete="email" placeholder="you@example.com">
              <p class="field-error" id="cerr-email"></p>
            </div>
            <div class="field full">
              <label for="ct-phone">Phone <span class="muted">(optional)</span></label>
              <input class="input" id="ct-phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile">
              <p class="field-error" id="cerr-phone"></p>
            </div>
            <div class="field full">
              <label for="ct-message">Message <span class="req">*</span></label>
              <textarea class="input" id="ct-message" name="message" placeholder="How can we help?"></textarea>
              <p class="field-error" id="cerr-message"></p>
            </div>
            <div class="full">
              <button class="btn btn-primary" type="submit">${icon('mail', 17)} Send Message</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>`;
}

export function mount() {
  const form = $('[data-form="contact"]');
  if (!form) return;

  form.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const rules = {
      name: ruleName(),
      email: ruleEmail(),
      phone: (v) => (!String(v || '').trim() || isMobile(v) ? '' : 'Please enter a valid 10-digit mobile number, or leave this blank.'),
      message: ruleMessage(),
    };
    const { valid, errors } = validate(data, rules);

    for (const key of Object.keys(rules)) {
      const field = form.querySelector(`[name="${key}"]`)?.closest('.field');
      const errEl = form.querySelector(`#cerr-${key}`);
      if (!field || !errEl) continue;
      field.classList.toggle('invalid', !!errors[key]);
      field.querySelector('.input')?.setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
      errEl.textContent = errors[key] || '';
    }
    if (!valid) {
      form.querySelector('.field.invalid .input')?.focus();
      return;
    }

    form.reset();
    $('[data-contact-success]').innerHTML = `
      <div class="error-summary" role="status" style="background:var(--secondary-soft);border-color:var(--secondary);color:var(--secondary)">
        Message sent! We usually reply within one working day. (Demo — no email is actually sent.)
      </div>`;
    toast('Message sent successfully!');
  });
}
