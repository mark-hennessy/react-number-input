export const sanitizeDataCyString = path => {
  // Convert resume[0].isOngoing to resume_0_isOngoing for example.
  // This is needed because Cypress does not accept . (dots) or brackets in data-cy attributes.
  return path.replace(/\[|\./g, '_').replace(/\]/g, '');
};

export const buildDataCyString = (name, suffix) => {
  if (!name) {
    return;
  }

  return sanitizeDataCyString(`${name}-${suffix}`);
};
