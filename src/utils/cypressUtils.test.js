import { buildDataCyString } from './cypressUtils';

describe('cypressUtils', () => {
  it('buildDataCyString', () => {
    expect(buildDataCyString('cart.items[0]')).toBe('cart_items_0');
    expect(buildDataCyString('items[1].name')).toBe('items_1_name');
    expect(buildDataCyString('grid.cells[0][1]')).toBe('grid_cells_0_1');
  });
});
