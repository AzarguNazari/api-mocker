import {
  generateUUID,
  generateEmail,
  generatePhoneNumber,
  generateURL,
  generateDateString,
  generateDateTimeString,
  generateRandomString,
  generateFromPattern,
  generateEnumValue,
  generateStringByPropertyName,
} from '../string-generator.util';

describe('String Generator Util', () => {
  describe('generateUUID', () => {
    it('should generate valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
  });

  describe('generateEmail', () => {
    it('should generate valid realistic email format', () => {
      const email = generateEmail();
      expect(email).toMatch(/^[a-z]+\.[a-z]+@[a-z]+\.(com|org|net|io|co|dev)$/);
    });
  });

  describe('generatePhoneNumber', () => {
    it('should generate phone number in realistic US format', () => {
      const phone = generatePhoneNumber();
      expect(phone).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
    });
  });

  describe('generateURL', () => {
    it('should generate valid URL', () => {
      const url = generateURL();
      expect(url).toMatch(/^https:\/\/example\.com\/resource\/\d+$/);
    });
  });

  describe('generateDateString', () => {
    it('should generate date in YYYY-MM-DD format', () => {
      const date = generateDateString();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('generateDateTimeString', () => {
    it('should generate ISO 8601 datetime string', () => {
      const datetime = generateDateTimeString();
      expect(datetime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string with mock prefix', () => {
      const str = generateRandomString();
      expect(str).toMatch(/^mock-[a-z0-9]+$/);
    });

    it('should respect length parameter', () => {
      const str = generateRandomString(16);
      expect(str.length).toBeGreaterThan(5);
    });
  });

  describe('generateFromPattern', () => {
    it('should replace pattern placeholders', () => {
      expect(generateFromPattern('[a-zA-Z]')).toBe('A');
      expect(generateFromPattern('[0-9]')).toBe('1');
      expect(generateFromPattern('[a-zA-Z0-9]')).toBe('X');
    });
  });

  describe('generateEnumValue', () => {
    it('should return value from enum array', () => {
      const enums = ['red', 'green', 'blue'];
      const result = generateEnumValue(enums);
      expect(enums).toContain(result);
    });
  });

  describe('generateStringByPropertyName', () => {
    it('should generate realistic email for email property', () => {
      const result = generateStringByPropertyName('user_email');
      expect(result).toMatch(/^[a-z]+\.[a-z]+@[a-z]+\.(com|org|net|io|co|dev)$/);
    });

    it('should generate realistic phone for phone property', () => {
      const result = generateStringByPropertyName('phoneNumber');
      expect(result).toMatch(/^\+1 \(\d{3}\) \d{3}-\d{4}$/);
    });

    it('should generate URL for url property', () => {
      const result = generateStringByPropertyName('website_url');
      expect(result).toMatch(/^https:\/\/example\.com\/resource\/\d+$/);
    });

    it('should return null for unknown property', () => {
      const result = generateStringByPropertyName('unknown');
      expect(result).toBeNull();
    });
  });
});
