// cypress does not accept . (dots) or brackets being part of strings being
// assigned to data-cy attributes
// an input such as resume[0].isOngoing will result in resume_0_isOngoing
export const buildDataCyString = path => {
  return path.replace(/\[|\./g, '_').replace(/\]/g, '');
};
