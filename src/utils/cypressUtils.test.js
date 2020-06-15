import { buildDataCyString } from './cypressUtils';

describe('cypressUtils', () => {
  it('buildDataCyString', () => {
    expect(buildDataCyString('form.input[0]')).toBe('form_input_0');
    expect(buildDataCyString('form.input[0][1]')).toBe('form_input_0_1');
  });
});
