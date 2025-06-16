import { Language } from '../types';

const DEFAULT_LANGUAGE = Language.English;

export const detectLanguage = (): Language => {
    const locale = document.documentElement.lang;

    switch (locale) {
        case 'pl-PL':
            return Language.Polish;
        case 'en-US':
        case 'en-GB':
            return Language.English;
        default:
            return DEFAULT_LANGUAGE;
    }
};
