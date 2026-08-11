/* Unit tests for validators. Run: npm test */
import assert from 'node:assert/strict';
import { isEmail, isMobile, isPincode, isName, normalizeMobile } from '../js/lib/validate.js';

assert.equal(isEmail('a@b.co'), true);
assert.equal(isEmail('bad'), false);
assert.equal(isEmail('x@y'), false);

assert.equal(isMobile('9876543210'), true);
assert.equal(isMobile('+91 98765 43210'), true);
assert.equal(isMobile('09876543210'), true);
assert.equal(normalizeMobile('+91-98765-43210'), '9876543210');
assert.equal(isMobile('1234567890'), false);
assert.equal(isMobile('987654321'), false);

assert.equal(isPincode('641001'), true);
assert.equal(isPincode('041001'), false);
assert.equal(isPincode('64100'), false);

assert.equal(isName('Ananya Sharma'), true);
assert.equal(isName('A'), false);
assert.equal(isName('Name123'), false);

console.log('✓ validate: all assertions passed');
