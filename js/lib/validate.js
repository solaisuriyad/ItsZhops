/* Pure validation helpers shared by checkout / contact / newsletter forms. */

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());

/** Indian mobile: 10 digits starting 6-9, optional +91 / 91 / 0 prefix. */
export function normalizeMobile(v) {
  let s = String(v || '').replace(/[\s\-().]/g, '');
  if (s.startsWith('+91')) s = s.slice(3);
  else if (s.length === 12 && s.startsWith('91')) s = s.slice(2);
  else if (s.length === 11 && s.startsWith('0')) s = s.slice(1);
  return s;
}
export const isMobile = (v) => /^[6-9]\d{9}$/.test(normalizeMobile(v));

export const isPincode = (v) => /^[1-9]\d{5}$/.test(String(v || '').trim());

export const isName = (v) => /^[A-Za-z][A-Za-z.\-']{1,}(\s+[A-Za-z.\-']+)*$/.test(String(v || '').trim()) && String(v || '').trim().length >= 3;

export const isAddress = (v) => String(v || '').trim().length >= 8;

export const isMessage = (v) => String(v || '').trim().length >= 10;

/**
 * Validate a flat map of values against a rules map.
 * Returns { valid, errors: {field: message} }
 */
export function validate(values, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const msg = rule(values[field]);
    if (msg) errors[field] = msg;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/* Rule factories returning an error message or '' */
export const required = (label) => (v) => (String(v || '').trim() ? '' : `${label} is required.`);
export const ruleName = () => (v) => (isName(v) ? '' : 'Please enter a valid full name (letters only).');
export const ruleMobile = () => (v) => (isMobile(v) ? '' : 'Please enter a valid 10-digit Indian mobile number.');
export const ruleEmail = () => (v) => (isEmail(v) ? '' : 'Please enter a valid email address.');
export const rulePincode = () => (v) => (isPincode(v) ? '' : 'PIN code must be a valid 6-digit Indian PIN.');
export const ruleAddress = () => (v) => (isAddress(v) ? '' : 'Address looks too short — add house no., street and area.');
export const ruleState = () => (v) => (String(v || '').trim() ? '' : 'Please select your state.');
export const ruleMessage = () => (v) => (isMessage(v) ? '' : 'Message should be at least 10 characters.');
