
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiGameEvent, Country, GeminiConflict, GeminiExtinctSpecies, Language, GeminiNuclearEvent, GeminiIntroNarration } from '../types';
import { COUNTRIES } from '../constants/countries';
import { createInitialState } from '../constants/state';
const geminiApiKey =
    (typeof import.meta !== 'undefined' && import.meta.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY); // fallback éventuel côté Node

if (!geminiApiKey) {
    throw new Error("Clé API Gemini manquante : définissez VITE_GEMINI_API_KEY dans .env");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const FETCH_CONTINENT_TIMEOUT_MS = 20000;

const languageMap: Record<Language, string> = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    de: 'German'
};

const countryDataSchema = {
    type: Type.OBJECT,
    properties: {
        pollutants: {
            type: Type.OBJECT,
            properties: {
                co2: { type: Type.NUMBER, description: 'CO2 pollution index, 0-100. Current realistic value.' },
                plastic: { type: Type.NUMBER, description: 'Plastic pollution index, 0-100. Current realistic value.' },
                deforestation: { type: Type.NUMBER, description: 'Deforestation index, 0-100. Current realistic value.' }
            },
            required: ['co2', 'plastic', 'deforestation']
        },
        population: { type: Type.NUMBER, description: 'Current total population.' },
        populationGrowthRate: { type: Type.NUMBER, description: 'Current annual population growth rate as a decimal (e.g., 0.01 for 1%).' },
        gdp: { type: Type.NUMBER, description: 'Current Gross Domestic Product in Trillions of US Dollars.' },
        healthIndex: { type: Type.NUMBER, description: 'Current Health Index from 0-100, based on pollution and other factors.' },
        energy: {
            type: Type.OBJECT,
            properties: {
                consumption: { type: Type.NUMBER, description: 'Current annual energy consumption in TWh.' },
                production: {
                    type: Type.OBJECT,
                    properties: {
                        renewable: { type: Type.NUMBER, description: 'Current annual renewable energy production in TWh.' },
                        nuclear: { type: Type.NUMBER, description: 'Current annual nuclear energy production in TWh.' },
                        thermal: { type: Type.NUMBER, description: 'Current annual thermal energy production in TWh.' }
                    },
                    required: ['renewable', 'nuclear', 'thermal']
                }
            },
            required: ['consumption', 'production']
        }
    },
    required: ['pollutants', 'population', 'populationGrowthRate', 'gdp', 'healthIndex', 'energy']
};

const fetchWithTimeout = (promise: Promise<any>, ms: number) => {
    let timeout = new Promise((_, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('API call timed out after ' + ms + ' ms');
        }, ms);
    });
    return Promise.race([
        promise,
        timeout
    ]);
};

export const fetchRealTimeData = async (
    updateLoader: (message: string, progress: number, isKey?: boolean) => void,
    t: (key: string, replacements?: { [key: string]: string | number }) => string,
    language: Language
): Promise<Country[] | null> => {
    try {
        const realisticState = createInitialState(true);
        const updatedCountries: Country[] = [];
        const totalContinents = COUNTRIES.length;

        for (let i = 0; i < totalContinents; i++) {
            const country = COUNTRIES[i];
            const progress = 10 + (80 / totalContinents) * (i + 1);
            const regionName = t(country.name);
            updateLoader(t('loader.fetching', { regionName }), progress);
            
            const promptLanguage = languageMap[language];
            const prompt = `Based on the latest available real-world data (as of today), provide a realistic simulation data snapshot for the region of ${regionName}. Adhere strictly to the JSON schema provided.
The response must be in ${promptLanguage}.
- GDP should be in Trillions of US Dollars.
- Population growth rate should be an annual decimal (e.g., 1% is 0.01).
- Pollution indices (co2, plastic, deforestation) are on a 0-100 scale where 100 is the worst possible level.
- Energy figures are in annual TWh.
- Health Index is a score from 0-100.`;

            try {
                const resultPromise = ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                  config: {
                    responseMimeType: 'application/json',
                    responseSchema: countryDataSchema,
                  },
                });
                
                const result = await fetchWithTimeout(resultPromise, FETCH_CONTINENT_TIMEOUT_MS) as any;
                
                const jsonStr = result.text.trim();
                const data = JSON.parse(jsonStr);

                const existingCountry = realisticState.countries.find(c => c.id === country.id);
                if (existingCountry) {
                    updatedCountries.push({
                        ...existingCountry,
                        ...data,
                    });
                }
            } catch (continentError) {
                console.warn(`Could not fetch data for ${regionName}:`, continentError);
                updateLoader(t('loader.fetchFailed', { regionName }), progress);
                const existingCountry = realisticState.countries.find(c => c.id === country.id);
                if (existingCountry) {
                    updatedCountries.push(existingCountry);
                }
            }
        }
        
        return updatedCountries;

    } catch (error) {
        console.error("Error fetching real-time world data:", error);
        updateLoader("loader.initFailed", 90, true);
        return null;
    }
};

const introNarrationSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A one or two-sentence description of the current world situation, following the prompt's stylistic rules." },
    },
    required: ['description']
};

const effectsSchema = {
    type: Type.OBJECT,
    properties: {
        co2_change: { type: Type.NUMBER, description: "Integer point change to CO2 pollution. Range: -5 to +10." },
        plastic_change: { type: Type.NUMBER, description: "Integer point change to Plastic pollution. Range: -5 to +10." },
        deforestation_change: { type: Type.NUMBER, description: "Integer point change to Deforestation. Range: -5 to +10." },
        eco_points_change_percent: { type: Type.NUMBER, description: "Integer percentage change to player's Eco Points. Range: -20 to +20." },
        public_support_change: { type: Type.NUMBER, description: "Integer point change to public support. Range: -15 to +15." },
        population_change: { type: Type.NUMBER, description: "Absolute integer change in global population. Range: -50,000,000 to +20,000,000." },
        gdp_change_percent: { type: Type.NUMBER, description: "Percentage change to global GDP. Range: -5 to +5." },
        health_index_change: { type: Type.NUMBER, description: "Absolute point change to global health index. Range: -10 to +10." },
        nuclear_threat_change: { type: Type.NUMBER, description: "Integer point change to nuclear threat level. Range: -20 to +20." }
    },
    required: ['co2_change', 'plastic_change', 'deforestation_change', 'eco_points_change_percent', 'public_support_change', 'population_change', 'gdp_change_percent', 'health_index_change']
};

const choiceEffectsSchema = {
    type: Type.OBJECT,
    properties: {
        co2_change: { type: Type.NUMBER, description: "Integer point change to CO2 pollution. Range: -5 to +10." },
        plastic_change: { type: Type.NUMBER, description: "Integer point change to Plastic pollution. Range: -5 to +10." },
        deforestation_change: { type: Type.NUMBER, description: "Integer point change to Deforestation. Range: -5 to +10." },
        eco_points_change_percent: { type: Type.NUMBER, description: "Integer percentage change to player's Eco Points. Range: -20 to +20." },
        public_support_change: { type: Type.NUMBER, description: "Integer point change to public support. Range: -15 to +15." },
        population_change: { type: Type.NUMBER, description: "Absolute integer change in global population. Range: -50,000,000 to +20,000,000." },
        gdp_change_percent: { type: Type.NUMBER, description: "Percentage change to global GDP. Range: -5 to +5." },
        health_index_change: { type: Type.NUMBER, description: "Absolute point change to global health index. Range: -10 to +10." },
        nuclear_threat_change: { type: Type.NUMBER, description: "Integer point change to nuclear threat level. Range: -20 to +30." }
    },
};

const eventSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A short, impactful title for the event (3-5 words)." },
        description: { type: Type.STRING, description: "A one or two-sentence description of the event." },
        category: { type: Type.STRING, description: "Categorize the event. Options: 'disaster', 'climate', 'war', 'breakthrough', 'political', 'social', 'economic'." },
        effects: {
            ...effectsSchema,
            description: "The base effects if the event times out or has no choices."
        },
        choices: {
            type: Type.ARRAY,
            description: "An array of 2-4 strategic choices. The last choice MUST be a zero-cost, no-effect option like 'Monitor the situation'.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "A short description of the choice (5-10 words)." },
                    cost: { type: Type.NUMBER, description: "The cost in Eco Points to select this choice. Must be 0 for the neutral option. For high-threat diplomatic choices, cost must be between 10000 and 20000." },
                    effects: {
                        ...choiceEffectsSchema,
                        description: "The effects for this choice. Must be an empty object {} for the neutral option."
                    }
                },
                required: ['text', 'cost', 'effects']
            }
        }
    },
    required: ['title', 'description', 'category', 'effects', 'choices']
};

const conflictSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A short, dramatic title for the conflict pop-up event (3-5 words)." },
        name: { type: Type.STRING, description: "A realistic name for the conflict, e.g., 'The Arctic Resource Skirmish'." },
        description: { type: Type.STRING, description: "A one-sentence description of the conflict and its causes." },
        intensity: { type: Type.NUMBER, description: "An integer from 1 (low) to 5 (high) representing the conflict's severity." }
    },
    required: ['title', 'name', 'description', 'intensity']
};

const extinctionSchema = {
    type: Type.OBJECT,
    properties: {
        speciesName: { type: Type.STRING, description: "The plausible name of a real (or realistic fictional) animal species." },
    },
    required: ['speciesName']
};

const nuclearEventSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A grim, one-sentence description of the nuclear exchange." },
        targets: { type: Type.ARRAY, description: "An array of 1-3 continent IDs that were targeted. IDs: NA, SA, EU, AF, AS, OC.", items: { type: Type.STRING } },
        strikes: { type: Type.NUMBER, description: "The total number of nuclear strikes, from 1 to 5." }
    },
    required: ['description', 'targets', 'strikes']
};

export const generateIntroNarration = async (language: Language, context: string): Promise<GeminiIntroNarration | null> => {
    try {
        const promptLanguage = languageMap[language];
        const prompt = `You are a narrator for a tense geopolitical and environmental simulation game. Your tone is serious and grim.
Create an immersive introductory briefing for the player based on the following world state summary.
World State Summary: ${context}

Follow these strict instructions for the narration:
1.  **Do NOT name specific continents, countries, or regions.** Be general. Use phrases like "industrial heartlands," "sprawling megalopolises," or "remote territories."
2.  **Vaguely mention ongoing conflicts.** Do not describe them in detail, but allude to the fact that tensions are high and the world is not at peace.
3.  **Crucially, link these tensions to the environment.** Explicitly state that the fight for dwindling resources, energy independence, and food security is fueling these conflicts.
4.  The overall feeling should be of a world on the brink, a fragile peace threatened by both ecological collapse and human conflict.

Provide a JSON object with the specified schema. The response text (description) must be in ${promptLanguage}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: introNarrationSchema,
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as GeminiIntroNarration;
    } catch (error) {
        console.error("Error generating intro narration:", error);
        return null;
    }
};

export const generateConflictEvent = async (country1Name: string, country2Name: string, year: number, language: Language, context: string): Promise<GeminiConflict | null> => {
    try {
        const promptLanguage = languageMap[language];
        const prompt = `You are a world conflict simulator for a geopolitical and environmental game. The year is ${year}.
A conflict is breaking out between two regions based on the current in-game situation:
${context}
Generate a realistic conflict scenario based on these conditions. The cause should be plausibly linked to resource scarcity, climate migration, or environmental tensions.
Provide a JSON object with the specified schema.
The response text (title, name, description) must be in ${promptLanguage}.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conflictSchema,
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as GeminiConflict;
    } catch (error) {
        console.error("Error generating conflict event:", error);
        return null;
    }
};


export const generateRandomEvent = async (language: Language, nuclearThreatLevel: number): Promise<GeminiGameEvent | null> => {
  try {
    const promptLanguage = languageMap[language];
    let prompt = `You are a world event simulator for a pollution control game. Generate a random global event that impacts pollution, economics, and society. The event must be interactive and impactful.
Provide a JSON object with the specified schema.
The response text (title, description, choices.text) must be in ${promptLanguage}.

Event Rules:
1. The event MUST include a 'choices' array with 2 to 3 strategic options plus one neutral option. Each choice should have a clear risk/reward.
2. **You MUST ALWAYS include a final, neutral 'inactive' choice with a cost of 0 and an empty effects object.** Examples: 'Monitor the situation', 'Take no immediate action', 'Observe and wait'.
3. The base 'effects' will be applied if the player fails to make a choice in time. These should represent the consequences of inaction and be significant.
4. The event should be creative and plausible within a near-future setting.`;

    if (nuclearThreatLevel > 50) {
        prompt += `
**HIGH ALERT**: The current nuclear threat level is ${nuclearThreatLevel}/100.
The event MUST be a **geopolitical escalation** related to this threat. Examples: military posturing, treaty violations, ultimatums.
- Choices must reflect this tension.
- Diplomatic de-escalation choices (reducing nuclear_threat_change) MUST have a VERY HIGH Eco Point cost between **10000 and 20000**.
- Aggressive choices should significantly INCREASE nuclear_threat_change.`;
    } else {
        prompt += `
Focus on events related to **global warming consequences** (e.g., extreme weather, melting ice caps, climate refugees) or **geopolitical conflict** (e.g., resource wars, border disputes over water, international tensions).`;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: eventSchema,
        },
      });
  
      const jsonStr = response.text.trim();
      return JSON.parse(jsonStr) as GeminiGameEvent;

  } catch (error) {
    console.error("Error generating random event:", error);
    return null;
  }
};

export const generateExtinctSpecies = async (cause: string, language: Language): Promise<GeminiExtinctSpecies | null> => {
    try {
        const promptLanguage = languageMap[language];
        const prompt = `For a simulation game, provide the name of a plausible animal species that has just gone extinct due to the primary cause of "${cause}". This can be a real species currently in critical danger or a realistic fictional one. The response must be a JSON object with the specified schema.
The species name must be in ${promptLanguage}.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: extinctionSchema,
            },
          });
      
          const jsonStr = response.text.trim();
          return JSON.parse(jsonStr) as GeminiExtinctSpecies;

    } catch (error) {
        console.error("Error generating extinct species:", error);
        return null;
    }
};

export const generateNuclearEvent = async (language: Language): Promise<GeminiNuclearEvent | null> => {
    try {
        const promptLanguage = languageMap[language];
        const prompt = `You are a grim narrator in a simulation game. A limited nuclear exchange has just occurred due to escalating global tensions.
Provide a JSON object describing this event according to the schema.
The description must be a single, somber sentence.
The response text must be in ${promptLanguage}.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: nuclearEventSchema,
            },
          });
      
          const jsonStr = response.text.trim();
          return JSON.parse(jsonStr) as GeminiNuclearEvent;

    } catch (error) {
        console.error("Error generating nuclear event:", error);
        return null;
    }
};