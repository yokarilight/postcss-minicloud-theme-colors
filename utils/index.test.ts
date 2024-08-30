import { isColor } from './index';

describe('isColor Function', () => {
  describe('Hex Color Validation', () => {
    it('should return true for valid hex color #ff5733', () => {
      expect(isColor('#ff5733')).toBe(true);
    });

    it('should return true for valid hex color #FFF', () => {
      expect(isColor('#FFF')).toBe(true);
    });

    it('should return true for valid hex color #000000', () => {
      expect(isColor('#000000')).toBe(true);
    });

    it('should return true for valid hex color #ABC', () => {
      expect(isColor('#ABC')).toBe(true);
    });

    it('should return true for valid hex color #abc123', () => {
      expect(isColor('#abc123')).toBe(true);
    });

    it('should return false for invalid hex color #xyzxyz', () => {
      expect(isColor('#xyzxyz')).toBe(false);
    });

    it('should return false for invalid hex color #FFFFF', () => {
      expect(isColor('#FFFFF')).toBe(false);
    });

    it('should return false for missing # in hex color ff5733', () => {
      expect(isColor('ff5733')).toBe(false);
    });
  });

  describe('RGBA Color Validation', () => {
    it('should return true for valid rgba color rgba(255, 99, 71, 0.5)', () => {
      expect(isColor('rgba(255, 99, 71, 0.5)')).toBe(true);
    });

    it('should return true for valid rgba color rgba(255, 255, 255, 1)', () => {
      expect(isColor('rgba(255, 255, 255, 1)')).toBe(true);
    });

    it('should return false for invalid rgba color rgba(255, 99, 71, 1.1)', () => {
      expect(isColor('rgba(255, 99, 71, 1.1)')).toBe(false);
    });

    it('should return false for invalid rgba color rgba(255, 99, 71, -0.5)', () => {
      expect(isColor('rgba(255, 99, 71, -0.5)')).toBe(false);
    });

    it('should return false for incomplete rgba color rgba(255, 99, 71)', () => {
      expect(isColor('rgba(255, 99, 71)')).toBe(false);
    });
  });

  describe('RGB Color Validation', () => {
    it('should return true for valid rgb color rgb(255, 99, 71)', () => {
      expect(isColor('rgb(255, 99, 71)')).toBe(true);
    });

    it('should return true for valid rgb color rgb(0, 0, 0)', () => {
      expect(isColor('rgb(0, 0, 0)')).toBe(true);
    });

    it('should return true for valid rgb color rgb(255, 255, 255)', () => {
      expect(isColor('rgb(255, 255, 255)')).toBe(true);
    });

    it('should return false for invalid rgb color rgb(256, 99, 71)', () => {
      expect(isColor('rgb(256, 99, 71)')).toBe(false);
    });

    it('should return false for invalid rgb color rgb(255,99,71,1)', () => {
      expect(isColor('rgb(255,99,71,1)')).toBe(false);
    });
  });

  describe('Non-Color String Validation', () => {
    it('should return false for non-color string "hello world"', () => {
      expect(isColor('hello world')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isColor('')).toBe(false);
    });

    it('should return false for hex color with invalid characters #12345g', () => {
      expect(isColor('#12345g')).toBe(false);
    });

    it('should return false for rgba color with out of range value rgba(300, 99, 71, 0.5)', () => {
      expect(isColor('rgba(300, 99, 71, 0.5)')).toBe(false);
    });
  });
});
