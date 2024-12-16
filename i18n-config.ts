export const i18n = {
    defaultLocale: 'en-AU',
    locales: ['en-AU'],
} as const;

export type Locale = typeof i18n['locales'][number];
