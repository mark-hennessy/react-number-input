import { buildDataCyString, sanitizeDataCyString } from './cypressUtils';

describe('cypressUtils', () => {
  it('sanitizeDataCyString', () => {
    expect(sanitizeDataCyString('cart.items[0]')).toBe('cart_items_0');
    expect(sanitizeDataCyString('items[1].name')).toBe('items_1_name');
    expect(sanitizeDataCyString('grid.cells[0][1]')).toBe('grid_cells_0_1');
  });

  it('buildDataCyString', () => {
    expect(buildDataCyString('cart.items[0]', 'number-input')).toBe(
      'cart_items_0-number-input',
    );
  });
});
