
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { de } from './de';

export const translations = {
    en,
    fr,
    es,
    de,
};

export type Language = keyof typeof translations;