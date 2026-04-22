export function validateUserDraft(draft) {
  const errors = {};

  if (!draft?.name?.trim()) errors.name = 'Full name is required.';
  if (!draft?.email?.trim()) errors.email = 'Email is required.';
  if (!draft?.country?.trim()) errors.country = 'Country is required.';

  return errors;
}

export function isUserDraftValid(draft) {
  return Object.keys(validateUserDraft(draft)).length === 0;
}
