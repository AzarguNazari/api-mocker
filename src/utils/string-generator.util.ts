import { generateRandomInteger } from './number-generator.util';
import {
  generateRealisticEmail,
  generateRealisticName,
  generateRealisticPhone,
  generateRealisticUsername,
  generateRealisticFirstName,
  generateRealisticLastName,
} from './personal-data.util';
import {
  generateRealisticAddress,
  generateRealisticCity,
  generateRealisticZipCode,
  generateRealisticState,
  generateRealisticCountry,
} from './address-data.util';
import {
  generateRealisticCompany,
  generateRealisticTitle,
  generateRealisticDescription,
} from './business-data.util';
import { generateRealisticCurrency } from './finance-data.util';
import { generateRealisticImage, generateRealisticAvatar } from './image-data.util';

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateEmail(): string {
  return generateRealisticEmail();
}

export function generatePhoneNumber(): string {
  return generateRealisticPhone();
}

export function generateURL(propertyName = ''): string {
  const lowerProp = propertyName.toLowerCase();
  if (lowerProp.includes('image') || lowerProp.includes('picture') || lowerProp.includes('photo') || lowerProp.includes('thumbnail')) {
    return generateRealisticImage();
  }
  if (lowerProp.includes('avatar') || lowerProp.includes('profile')) {
    return generateRealisticAvatar();
  }
  const randomId = generateRandomInteger(1, 9999);
  return `https://example.com/resource/${randomId}`;
}

export function generateDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateDateTimeString(): string {
  return new Date().toISOString();
}

export function generateRandomString(length = 8): string {
  return `mock-${Math.random()
    .toString(36)
    .substring(2, 2 + length)}`;
}

export function generateFromPattern(pattern: string): string {
  return pattern
    .replace(/\[a-zA-Z\]/g, 'A')
    .replace(/\[0-9\]/g, '1')
    .replace(/\[a-zA-Z0-9\]/g, 'X');
}

export function generateEnumValue<T>(enumValues: T[]): T {
  const index = generateRandomInteger(0, enumValues.length - 1);
  return enumValues[index];
}

export function generateStringByPropertyName(propertyName: string): string | null {
  const lowerProp = propertyName.toLowerCase();

  if (lowerProp.includes('email')) {
    return generateEmail();
  }

  if (lowerProp.includes('phone')) {
    return generatePhoneNumber();
  }

  if (lowerProp.includes('url') || lowerProp.includes('link') || lowerProp.includes('website') || lowerProp.includes('image') || lowerProp.includes('picture') || lowerProp.includes('photo') || lowerProp.includes('avatar')) {
    return generateURL(propertyName);
  }

  if (lowerProp.includes('name') && !lowerProp.includes('user') && !lowerProp.includes('file')) {
    if (lowerProp.includes('first')) {
      return generateRealisticFirstName();
    }
    if (lowerProp.includes('last')) {
      return generateRealisticLastName();
    }
    return generateRealisticName();
  }

  if (lowerProp.includes('user') && (lowerProp.includes('name') || lowerProp === 'user')) {
    return generateRealisticUsername();
  }

  if (lowerProp.includes('address') || lowerProp.includes('street')) {
    return generateRealisticAddress();
  }

  if (lowerProp.includes('city')) {
    return generateRealisticCity();
  }

  if (lowerProp.includes('state') || lowerProp.includes('province')) {
    return generateRealisticState();
  }

  if (lowerProp.includes('zip') || lowerProp.includes('postal')) {
    return generateRealisticZipCode();
  }

  if (lowerProp.includes('country')) {
    return generateRealisticCountry();
  }

  if (lowerProp.includes('currency')) {
    return generateRealisticCurrency();
  }

  if (lowerProp.includes('company') || lowerProp.includes('organization')) {
    return generateRealisticCompany();
  }

  if (lowerProp.includes('title') || lowerProp.includes('position') || lowerProp.includes('job')) {
    return generateRealisticTitle();
  }

  if (
    lowerProp.includes('description') ||
    lowerProp.includes('bio') ||
    lowerProp.includes('about')
  ) {
    return generateRealisticDescription();
  }

  return null;
}
