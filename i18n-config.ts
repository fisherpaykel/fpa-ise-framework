export const i18n = {
    defaultLocale: 'en-AU',
    locales: ['en-AU'] as const,
    defaultCountryCode: 'AU',
    countryCodes: ['NZ', 'AU'] as const,
  } as const;
  
  type Locale = typeof i18n['locales'][number];
  type CountryCode = typeof i18n['countryCodes'][number];
  
  export function isCountryCode(value: string): value is CountryCode {
    return i18n.countryCodes.includes(value as CountryCode);
  }
  
  export function isLocale(value: string): value is Locale {
    return i18n.locales.includes(value as Locale);
  }
