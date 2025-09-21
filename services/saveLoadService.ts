

import type { GameState, SaveSlotInfo } from '../types';
import { INTERSTITIAL_AD_TICKS } from '../constants/state';

const SAVE_KEY_PREFIX = 'depollution_sim_save_';
const MAX_SLOTS = 3;

const replacer = (key: string, value: any) => {
    if (key === 'date' || key === 'completionDate' || key === 'startDate') {
        return new Date(value).toISOString();
    }
    return value;
};

const reviver = (key: string, value: any) => {
    if ((key === 'date' || key === 'completionDate' || key === 'startDate') && typeof value === 'string') {
        return new Date(value);
    }
    if (key === 'activeActions' && Array.isArray(value)) {
         return value.map(action => ({ ...action, completionDate: new Date(action.completionDate) }));
    }
    return value;
};

export const saveGame = (slotId: number, gameState: GameState): void => {
    if (slotId < 1 || slotId > MAX_SLOTS) {
        console.error(`Invalid save slot: ${slotId}`);
        return;
    }
    try {
        const stateString = JSON.stringify(gameState, replacer);
        localStorage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, stateString);
    } catch (error) {
        console.error('Failed to save game:', error);
    }
};

export const loadGame = (slotId: number): GameState | null => {
    if (slotId < 1 || slotId > MAX_SLOTS) {
        console.error(`Invalid load slot: ${slotId}`);
        return null;
    }
    try {
        const stateString = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotId}`);
        if (stateString) {
            const gameState: GameState = JSON.parse(stateString, reviver);
            
            // Backwards compatibility for saves without ad properties
            if (typeof gameState.hasPaidToRemoveAds === 'undefined') {
                gameState.hasPaidToRemoveAds = false;
            }
            if (typeof gameState.ticksUntilNextInterstitial === 'undefined') {
                gameState.ticksUntilNextInterstitial = INTERSTITIAL_AD_TICKS;
            }

            return gameState;
        }
        return null;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
};

export const getSaveSlotsInfo = (): SaveSlotInfo[] => {
    const slots: SaveSlotInfo[] = [];
    for (let i = 1; i <= MAX_SLOTS; i++) {
        const slotInfo: SaveSlotInfo = { slotId: i, exists: false };
        const stateString = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`);
        if (stateString) {
            try {
                const data = JSON.parse(stateString);
                slotInfo.exists = true;
                slotInfo.date = new Date(data.date).toISOString();
                slotInfo.totalPollution = data.totalPollution;
                slotInfo.language = data.language || 'en';
            } catch (error) {
                console.error(`Failed to parse save slot ${i}:`, error);
                slotInfo.exists = false;
            }
        }
        slots.push(slotInfo);
    }
    return slots;
};