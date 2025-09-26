import React, {useState, useEffect, useCallback} from 'react';
import type {
    GameState,
    Action,
    ActiveGameEvent,
    Country,
    ActiveAction,
    SaveSlotInfo,
    EventChoice,
    GameEventEffects,
    Pollutants,
    Conflict,
    Language,
    GeminiNuclearEvent,
    GeminiIntroNarration,
    Tech
} from './types';
import {PollutantType} from './types';
import {saveGame, loadGame, getSaveSlotsInfo} from './services/saveLoadService';
import Header from './components/Header';
import MainControls from './components/MainControls';
import InfoPanels from './components/InfoPanels';
import ActionsPanel from './components/ActionsPanel';
import EventLog from './components/EventLog';
import GameEndModal from './components/GameEndModal';
import {WorldMap} from './components/WorldMap';
import EventModal from './components/EventModal';
import GameMenuModal from './components/GameMenuModal';
import InitializationLoader from './components/InitializationLoader';
import IntroModal from './components/IntroModal';
import BannerAd from './components/BannerAd';
import InterstitialAd from './components/InterstitialAd';
import {IMAGES} from './assets/images';
import {LocalizationProvider} from './context/LocalizationContext';
import {useLocalization} from './hooks/useLocalization';

// Imports from the refactored constants directory
import {ACTIONS} from './constants/actions';
import {createHealthCrisisAlert, EVENT_TIMER_SECONDS} from './constants/events';
import {
    createInitialState,
    GAME_SPEED_MS,
    GAME_SPEED_MULTIPLIERS,
    MIN_EVENT_TICKS,
    MAX_EVENT_TICKS,
    CO2_STABILITY_INDEX,
    WARMING_RATE_FACTOR,
    CONFLICT_CHECK_TICKS,
    EXTINCTION_CHECK_TICKS,
    POPULATION_GAMEOVER_THRESHOLD,
    INTERSTITIAL_AD_TICKS
} from './constants/state';
import {CONFLICT_INSTABILITY_THRESHOLD, CONFLICT_INTENSITY_EFFECTS} from './constants/conflicts';
import {
    generateRandomEvent,
    fetchRealTimeData,
    generateConflictEvent,
    generateExtinctSpecies,
    generateNuclearEvent,
    generateIntroNarration
} from './services/geminiService';
import {TECH_TREES, TECH_COST_REDUCTION_FACTOR, TECH_EFFECT_BONUS_FACTOR} from './constants/tech';


const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(createInitialState());
    const [eventLog, setEventLog] = useState<string[]>(['Welcome to the Global Depollution Simulator.']);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
    const [gameHasStarted, setGameHasStarted] = useState<boolean>(false);
    const [saveSlots, setSaveSlots] = useState<SaveSlotInfo[]>([]);
    const [isInitializing, setIsInitializing] = useState<boolean>(false);
    const [loaderStatus, setLoaderStatus] = useState<{ progress: number; message: string }>({progress: 0, message: ''});
    const [introModalData, setIntroModalData] = useState<GeminiIntroNarration | null>(null);
    const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
    const {language, setLanguage, t, ready} = useLocalization();

    console.log('🎯 DEBUG - IMAGES loaded:', IMAGES);
    console.log('🎯 DEBUG - IMAGES keys:', Object.keys(IMAGES));
    console.log('🎯 DEBUG - Sample image (DEFAULT):', IMAGES.DEFAULT);

    const pickImage = (key: keyof typeof IMAGES): string => {
        const v = IMAGES[key];
        return typeof v === 'function' ? (v as () => string)() : (v as string);
    };

    useEffect(() => {
        // Sync language changes from context to game state for saving
        if (ready) {
            setGameState(prev => ({...prev, language}));
        }
    }, [language, ready]);

    const refreshSaveSlots = useCallback(() => {
        setSaveSlots(getSaveSlotsInfo());
    }, []);

    useEffect(() => {
        refreshSaveSlots();
    }, [refreshSaveSlots]);

    const addToLog = useCallback((message: string, isKey = false, replacements?: {
        [key: string]: string | number
    }) => {
        setGameState(prev => {
            setEventLog(logPrev => {
                const translatedMessage = isKey && ready ? t(message, replacements) : message;
                const year = new Date(prev.date).getFullYear();
                return [`[${year}] ${translatedMessage}`, ...logPrev.slice(0, 9)];
            });
            return prev;
        });
    }, [t, ready]);

    const handleMenuToggle = (open: boolean) => {
        if (open && gameState.ticksUntilNextInterstitial <= 0 && !gameState.hasPaidToRemoveAds && gameHasStarted) {
            setShowInterstitial(true);
            setIsPaused(true);
            setGameState(prev => ({...prev, ticksUntilNextInterstitial: INTERSTITIAL_AD_TICKS}));
        } else {
            setIsMenuOpen(open);
            if (gameHasStarted) {
                setIsPaused(open);
            }
        }
    };

    const handleCloseInterstitial = () => {
        setShowInterstitial(false);
        setIsMenuOpen(true);
    };

    const handleRemoveAds = () => {
        setGameState(prev => ({...prev, hasPaidToRemoveAds: true}));
        addToLog('logs.removeAdsConfirm', true);
    };

    const handleNewGame = async () => {
        setIsInitializing(true);
        setIsMenuOpen(false);

        const updateLoader = (message: string, progress: number, isKey = false) => {
            const translatedMessage = isKey ? t(message) : message;
            setLoaderStatus({progress: Math.round(progress), message: translatedMessage});
        };

        updateLoader('loader.connecting', 10, true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const realTimeData = await fetchRealTimeData(updateLoader, t, language);

        let initialState;
        const tempLog: string[] = [];
        const langToSet = language; // Keep current language
        setLanguage(langToSet);

        if (realTimeData) {
            updateLoader('loader.calibrating', 85, true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            tempLog.push(t('logs.initSuccess'));
            initialState = createInitialState(true, realTimeData);
        } else {
            updateLoader('loader.fallback', 85, true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            tempLog.push(t('logs.initFallback'));
            initialState = createInitialState(true);
        }

        updateLoader('loader.finalizing', 95, true);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Generate intro narration
        const conflictContext = initialState.activeConflicts.map(c => t(c.name)).join(', ');
        const globalPollutionAvg = initialState.totalPollution;
        const context = `Initial conflicts: ${conflictContext || 'None'}. The average global pollution index is ${globalPollutionAvg.toFixed(0)}/100.`;
        const narration = await generateIntroNarration(language, context);
        if (narration) {
            setIntroModalData(narration);
        }

        setGameState({...initialState, language: langToSet});
        setEventLog([...tempLog, ...initialState.activeConflicts.map(c => `${t('logs.warPrefix')}: ${c.name} ${t('logs.warOngoing')}.`)]);
        setGameHasStarted(true);
        setIsPaused(true); // Game starts paused for the intro modal

        updateLoader('loader.done', 100, true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsInitializing(false);
    };

    const handleCloseIntroModal = () => {
        setIntroModalData(null);
        setIsPaused(false);
        addToLog('logs.simulationStarted', true);
    };

    const handleSaveGame = (slotId: number) => {
        saveGame(slotId, gameState);
        refreshSaveSlots();
        addToLog('logs.gameSaved', true, {slotId});
        setIsMenuOpen(false);
        setIsPaused(false);
    };

    const handleLoadGame = (slotId: number) => {
        const loadedState = loadGame(slotId);
        if (loadedState) {
            setGameState(loadedState);
            setLanguage(loadedState.language || 'en');
            addToLog('logs.gameLoaded', true, {slotId});
            setGameHasStarted(true);
            setIsPaused(false);
            setIsMenuOpen(false);
        }
    };

    const handlePauseToggle = () => {
        if (gameHasStarted && !isMenuOpen && !gameState.activeEvent && !gameState.isGameOver && !introModalData) {
            setIsPaused(prev => !prev);
        }
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setGameState(prev => ({...prev, language: lang}));
    };

    const handleSpeedChange = (newSpeed: 1 | 2 | 3) => {
        setGameState(prev => ({...prev, gameSpeed: newSpeed}));
        if (gameHasStarted && !isMenuOpen && !gameState.activeEvent && !gameState.isGameOver) {
            setIsPaused(false);
        }
    };

    const handleCountrySelect = (countryId: string | null) => {
        setGameState(prev => ({
            ...prev,
            selectedCountryId: countryId,
        }));
    };

    const getTechForEffect = (effectType: string): keyof Country['tech'] | null => {
        switch (effectType) {
            case PollutantType.CO2:
            case 'energyRenewable':
            case 'energyNuclear':
            case 'energyThermal':
                return 'co2';
            case PollutantType.Plastic:
                return 'waste';
            case PollutantType.Deforestation:
                return 'deforestation';
            default:
                return null;
        }
    };

    const applyEventEffects = (effects: Partial<GameEventEffects>) => {
        setGameState(prev => {
            const newCountries = prev.countries.map(c => ({
                ...c,
                pollutants: {
                    co2: Math.max(0, Math.min(100, c.pollutants.co2 + (effects.co2_change || 0) / prev.countries.length)),
                    plastic: Math.max(0, Math.min(100, c.pollutants.plastic + (effects.plastic_change || 0) / prev.countries.length)),
                    deforestation: Math.max(0, Math.min(100, c.pollutants.deforestation + (effects.deforestation_change || 0) / prev.countries.length)),
                },
                gdp: c.gdp * (1 + (effects.gdp_change_percent || 0) / 100),
                healthIndex: Math.max(0, Math.min(100, c.healthIndex + (effects.health_index_change || 0) / prev.countries.length)),
                population: Math.max(0, c.population + Math.round((effects.population_change || 0) / prev.countries.length)),
            }));

            return {
                ...prev,
                countries: newCountries,
                ecoPoints: Math.round(prev.ecoPoints * (1 + (effects.eco_points_change_percent || 0) / 100)),
                publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (effects.public_support_change || 0))),
                nuclearThreatLevel: Math.max(0, Math.min(100, prev.nuclearThreatLevel + (effects.nuclear_threat_change || 0))),
            };
        });
    };

    const handleEventChoice = (choice: EventChoice) => {
        if (gameState.activeEvent) {
            if (gameState.ecoPoints >= choice.cost) {
                setGameState(prev => ({...prev, ecoPoints: prev.ecoPoints - choice.cost}));
                applyEventEffects(choice.effects);
                addToLog('logs.actionTaken', true, {eventTitle: gameState.activeEvent.title, choiceText: choice.text});
            }
            // ✅ VITESSE PRÉSERVÉE : gameSpeed n'est pas modifié ici, donc la vitesse est maintenue
            setGameState(prev => ({...prev, activeEvent: null, eventTimer: null}));
        }
    };

    const handleCloseEvent = () => {
        setGameState(prev => {
            if (prev.activeEvent?.isConflictDeclaration) {
                addToLog('logs.warErupted', true, {
                    conflictName: prev.activeEvent.conflictDetails!.name,
                    country1Name: t(prev.countries.find(c => c.id === prev.activeEvent!.conflictDetails!.involvedCountryIds[0])!.name),
                    country2Name: t(prev.countries.find(c => c.id === prev.activeEvent!.conflictDetails!.involvedCountryIds[1])!.name)
                });
                return {
                    ...prev,
                    activeEvent: null,
                    activeConflicts: [...prev.activeConflicts, prev.activeEvent.conflictDetails!],
                };
            }
            if (prev.activeEvent?.isNuclearStrike) {
                const {targets, strikes} = prev.activeEvent.nuclearStrikeDetails!;
                const targetsStr = targets.map(id => {
                    const country = prev.countries.find(c => c.id === id);
                    return country ? t(country.name) : id;
                }).join(', ');
                addToLog('logs.nuclearStrike', true, {strikes, targets: targetsStr});
            } else {
                addToLog('logs.eventAcknowledged', true, {eventTitle: prev.activeEvent!.title});
            }
            return {...prev, activeEvent: null};
        });
    };

    const handleAction = (action: Action, countryId: string) => {
        const country = gameState.countries.find(c => c.id === countryId);
        if (!country) return;

        let finalCost = action.cost;
        action.effects.forEach(effect => {
            const techId = getTechForEffect(effect.type);
            if (techId) {
                const techLevel = country.tech[techId];
                finalCost -= action.cost * techLevel * TECH_COST_REDUCTION_FACTOR;
            }
        });
        finalCost = Math.round(finalCost);

        if (gameState.ecoPoints < finalCost) return;

        const durationMonths = Math.floor(Math.random() * (action.duration.max - action.duration.min + 1)) + action.duration.min;
        const completionDate = new Date(gameState.date);
        completionDate.setMonth(completionDate.getMonth() + durationMonths);

        const newActiveAction: ActiveAction = {
            id: `${Date.now()}-${Math.random()}`,
            actionId: action.id,
            countryId,
            name: action.name,
            completionDate,
        };

        setGameState(prev => ({
            ...prev,
            ecoPoints: prev.ecoPoints - finalCost,
            activeActions: [...prev.activeActions, newActiveAction],
        }));

        addToLog('logs.projectStarted', true, {
            countryName: t(country.name),
            actionName: t(action.name),
            cost: finalCost
        });
    };

    const handleTechUpgrade = (techId: keyof Tech, countryId: string) => {
        const country = gameState.countries.find(c => c.id === countryId);
        const techTree = TECH_TREES.find(t => t.id === techId);
        if (!country || !techTree) return;

        const currentLevel = country.tech[techId];
        if (currentLevel >= techTree.levels.length) return;

        const upgradeInfo = techTree.levels[currentLevel];
        if (gameState.ecoPoints < upgradeInfo.cost) return;

        setGameState(prev => ({
            ...prev,
            ecoPoints: prev.ecoPoints - upgradeInfo.cost,
            countries: prev.countries.map(c =>
                c.id === countryId ? {...c, tech: {...c.tech, [techId]: currentLevel + 1}} : c
            ),
        }));

        addToLog('logs.techUpgraded', true, {
            countryName: t(country.name),
            techName: t(techTree.name),
            level: currentLevel + 1
        });
    };

    useEffect(() => {
        if (isPaused || gameState.isGameOver || isInitializing || introModalData) return;

        const gameTick = setTimeout(() => {
            setGameState(prev => {
                const newDate = new Date(prev.date);
                newDate.setMonth(newDate.getMonth() + 1);

                const completedActions = prev.activeActions.filter(a => a.completionDate <= newDate);
                const remainingActions = prev.activeActions.filter(a => a.completionDate > newDate);

                let newCountries = [...prev.countries];
                let newPublicSupport = prev.publicSupport;

                completedActions.forEach(completedAction => {
                    const actionDetails = ACTIONS.find(a => a.id === completedAction.actionId);
                    const country = newCountries.find(c => c.id === completedAction.countryId);
                    if (!actionDetails || !country) return;

                    addToLog('logs.projectCompleted', true, {
                        actionName: t(actionDetails.name),
                        countryName: t(country.name)
                    });

                    actionDetails.effects.forEach(effect => {
                        let effectValue = effect.value;
                        const techId = getTechForEffect(effect.type);
                        if (techId) {
                            const techLevel = country.tech[techId];
                            if (effectValue < 0) {
                                effectValue *= (1 + techLevel * TECH_EFFECT_BONUS_FACTOR);
                            } else {
                                effectValue *= (1 + techLevel * TECH_EFFECT_BONUS_FACTOR);
                            }
                        }
                        effectValue = Math.round(effectValue);

                        switch (effect.type) {
                            case PollutantType.CO2:
                            case PollutantType.Plastic:
                            case PollutantType.Deforestation:
                                newCountries = newCountries.map(c => c.id === completedAction.countryId ? {
                                    ...c,
                                    pollutants: {
                                        ...c.pollutants,
                                        [effect.type]: Math.max(0, c.pollutants[effect.type] + effectValue)
                                    }
                                } : c);
                                break;
                            case 'publicSupport':
                                newPublicSupport = Math.min(100, newPublicSupport + effectValue);
                                break;
                            case 'energyRenewable':
                                newCountries = newCountries.map(c => c.id === completedAction.countryId ? {
                                    ...c,
                                    energy: {
                                        ...c.energy,
                                        production: {
                                            ...c.energy.production,
                                            renewable: c.energy.production.renewable + effectValue
                                        }
                                    }
                                } : c);
                                break;
                            case 'energyNuclear':
                                newCountries = newCountries.map(c => c.id === completedAction.countryId ? {
                                    ...c,
                                    energy: {
                                        ...c.energy,
                                        production: {
                                            ...c.energy.production,
                                            nuclear: c.energy.production.nuclear + effectValue
                                        }
                                    }
                                } : c);
                                break;
                            case 'energyThermal':
                                newCountries = newCountries.map(c => c.id === completedAction.countryId ? {
                                    ...c,
                                    energy: {
                                        ...c.energy,
                                        production: {
                                            ...c.energy.production,
                                            thermal: Math.max(0, c.energy.production.thermal + effectValue)
                                        }
                                    }
                                } : c);
                                break;
                        }
                    });
                });

                let totalCO2Index = 0;
                newCountries = newCountries.map(c => {
                    const monthlyGdpGrowth = c.gdp * (c.gdpGrowthRate / 12);
                    let newGdp = c.gdp + monthlyGdpGrowth;

                    let co2Increase = newGdp * 0.0001;
                    let plasticIncrease = newGdp * 0.00008;
                    let deforestationIncrease = newGdp * 0.00005;

                    const thermalPollutionFactor = 0.0001;
                    co2Increase += c.energy.production.thermal * thermalPollutionFactor;

                    if (c.healthIndex < 50) {
                        newGdp -= monthlyGdpGrowth * ((50 - c.healthIndex) / 50);
                    }

                    const newPopulation = c.population * (1 + c.populationGrowthRate / 12);

                    const newPollutants: Pollutants = {
                        co2: Math.min(100, c.pollutants.co2 + co2Increase),
                        plastic: Math.min(100, c.pollutants.plastic + plasticIncrease),
                        deforestation: Math.min(100, c.pollutants.deforestation + deforestationIncrease),
                    };

                    const avgPollution = (newPollutants.co2 + newPollutants.plastic + newPollutants.deforestation) / 3;
                    
                    // ✅ NOUVEAU SYSTÈME D'INDICE DE SANTÉ AVEC INERTIE
                    // Vérifier d'abord si le pays est en conflit
                    const isInConflict = prev.activeConflicts.some(con => con.involvedCountryIds.includes(c.id));
                    
                    // Calcul de l'indice de santé cible basé sur la pollution
                    const targetHealthIndex = Math.max(10, Math.min(90, 100 - avgPollution * 0.8));
                    
                    // Facteur d'inertie : plus l'écart est grand, plus le changement est rapide
                    const healthDifference = targetHealthIndex - c.healthIndex;
                    const inertieFactor = Math.abs(healthDifference) > 20 ? 0.08 : 0.03; // Changement plus rapide si écart important
                    
                    // Application de l'inertie avec amortissement
                    let healthChange = healthDifference * inertieFactor;
                    
                    // Facteurs modificateurs
                    // Conflit : impact négatif sur la santé
                    if (isInConflict) {
                        healthChange -= 0.5;
                    }
                    
                    // Bonus pour faible pollution (effet positif renforcé)
                    if (avgPollution < 30) {
                        healthChange += 0.2;
                    }
                    
                    // Malus pour pollution très élevée (effet négatif renforcé)
                    if (avgPollution > 70) {
                        healthChange -= 0.3;
                    }
                    
                    // Application du changement avec limites
                    let newHealthIndex = Math.max(0, Math.min(100, c.healthIndex + healthChange));
                    
                    // Mise à jour des champs de suivi pour le système de crises
                    const previousHealthIndex = c.healthIndex;
                    const ticksInCurrentLevel = c.healthCrisisLevel === 0 ? 0 : (c.ticksInCurrentHealthLevel || 0) + 1;

                    totalCO2Index += newPollutants.co2;

                    // Calcul de l'instabilité (isInConflict déjà défini plus haut)
                    let newInstability = c.instability;
                    if (isInConflict) {
                        newInstability = Math.min(100, newInstability + 0.5);
                    } else {
                        newInstability = Math.max(0, newInstability - 0.2);
                    }

                    return {
                        ...c,
                        gdp: newGdp,
                        population: newPopulation,
                        pollutants: newPollutants,
                        healthIndex: newHealthIndex,
                        instability: newInstability,
                        // ✅ Nouveaux champs pour le suivi de l'évolution de la santé
                        previousHealthIndex,
                        ticksInCurrentHealthLevel: ticksInCurrentLevel
                    };
                });

                const globalGdp = newCountries.reduce((sum, c) => sum + c.gdp, 0);
                const ecoPointsGain = Math.round((globalGdp * 0.5) + (newPublicSupport * 2));
                const newEcoPoints = prev.ecoPoints + ecoPointsGain;

                const newGlobalWarming = prev.globalWarming + (totalCO2Index / newCountries.length) * WARMING_RATE_FACTOR;

                const biodiversityLoss = (prev.totalPollution / 100) * 0.01 + (newGlobalWarming / 5) * 0.01;
                const newBiodiversityIndex = Math.max(0, prev.biodiversityIndex - biodiversityLoss);

                let newTotalPollution = newCountries.reduce((sum, c) => sum + c.pollutants.co2 + c.pollutants.plastic + c.pollutants.deforestation, 0) / (newCountries.length * 3);

                return {
                    ...prev,
                    date: newDate,
                    countries: newCountries,
                    ecoPoints: newEcoPoints,
                    publicSupport: newPublicSupport,
                    activeActions: remainingActions,
                    totalPollution: newTotalPollution,
                    ticksUntilNextEvent: prev.ticksUntilNextEvent - 1,
                    ticksUntilConflictCheck: prev.ticksUntilConflictCheck - 1,
                    ticksUntilExtinctionCheck: prev.ticksUntilExtinctionCheck - 1,
                    ticksUntilNextInterstitial: prev.ticksUntilNextInterstitial > 0 ? prev.ticksUntilNextInterstitial - 1 : 0,
                    playtimeSeconds: prev.playtimeSeconds + (GAME_SPEED_MS / 1000) / GAME_SPEED_MULTIPLIERS[prev.gameSpeed],
                    globalWarming: newGlobalWarming,
                    biodiversityIndex: newBiodiversityIndex,
                };
            });
        }, GAME_SPEED_MS / GAME_SPEED_MULTIPLIERS[gameState.gameSpeed]);

        return () => clearTimeout(gameTick);
    }, [gameState, isPaused, isInitializing, introModalData, t, addToLog]);

    useEffect(() => {
        if (gameState.activeEvent && gameState.eventTimer !== null && gameState.eventTimer > 0 && !isPaused) {
            const timer = setTimeout(() => {
                setGameState(prev => ({...prev, eventTimer: prev.eventTimer! - 1}));
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState.activeEvent && gameState.eventTimer === 0) {
            applyEventEffects(gameState.activeEvent.baseEffects);
            addToLog('logs.eventTimedOut', true, {eventTitle: gameState.activeEvent.title});
            setGameState(prev => ({...prev, activeEvent: null, eventTimer: null}));
        }
    }, [gameState.activeEvent, gameState.eventTimer, isPaused, addToLog]);

    useEffect(() => {
        const triggerEvent = async () => {
            if (isGenerating || isPaused || gameState.isGameOver || gameState.activeEvent) return;
            setIsGenerating(true);
            addToLog('logs.unusualPatterns', true);
            const eventData = await generateRandomEvent(language, gameState.nuclearThreatLevel);
            if (eventData) {
                const category = eventData.category.toUpperCase();
                console.log('🖼️ DEBUG Images - Category:', category);
                console.log('🖼️ DEBUG Images - Available IMAGES:', Object.keys(IMAGES));
                const imageUrl = pickImage((category as keyof typeof IMAGES)) ?? pickImage('DEFAULT');
                console.log('🖼️ DEBUG Images - Selected imageUrl:', imageUrl);
                console.log('🖼️ DEBUG Images - imageUrl type:', typeof imageUrl);
                setGameState(prev => ({
                    ...prev,
                    activeEvent: {
                        id: `event-${Date.now()}`,
                        title: eventData.title,
                        description: eventData.description,
                        imageUrl,
                        choices: eventData.choices,
                        baseEffects: eventData.effects,
                    },
                    eventTimer: EVENT_TIMER_SECONDS,
                }));
                addToLog('logs.newEvent', true, {eventTitle: eventData.title});
            } else {
                addToLog('logs.patternsStabilized', true);
            }
            setGameState(prev => ({
                ...prev,
                ticksUntilNextEvent: Math.floor(Math.random() * (MAX_EVENT_TICKS - MIN_EVENT_TICKS + 1)) + MIN_EVENT_TICKS
            }));
            setIsGenerating(false);
        };

        if (gameState.ticksUntilNextEvent <= 0) {
            triggerEvent();
        }
    }, [gameState.ticksUntilNextEvent, isGenerating, isPaused, gameState.isGameOver, language, gameState.activeEvent, gameState.nuclearThreatLevel, addToLog]);

    useEffect(() => {
        // ✅ SYSTÈME DE CRISES SANITAIRES ÉQUILIBRÉ
        const HEALTH_CRISIS_COOLDOWN = 180; // 6 minutes entre crises par pays (plus réaliste)
        const MIN_CRISIS_DURATION = 36;     // 72 secondes avant escalade (plus de temps pour réagir)
        const MAX_SIMULTANEOUS_CRISES = 3;  // Maximum 3 crises simultanées (plus de dynamisme)

        // Compter les crises actuelles
        const currentHealthCrises = gameState.countries.filter(c => c.healthCrisisLevel > 0).length;

        gameState.countries.forEach((country, index) => {
            if (gameState.activeEvent) return;

            // Calculer le tick actuel (approximatif)
            const currentTick = Math.floor(gameState.playtimeSeconds / 2);

            // Vérifier le cooldown
            const ticksSinceLastCrisis = currentTick - (country.healthCrisisLastTick || 0);
            if (ticksSinceLastCrisis < HEALTH_CRISIS_COOLDOWN) return;

            // ✅ SEUILS DE CRISES AJUSTÉS POUR PLUS DE RÉALISME
            let crisisLevel = 0;
            if (country.healthIndex < 35) crisisLevel = 1; // Alerte précoce (était 25)
            if (country.healthIndex < 25) crisisLevel = 2; // Crise modérée (était 15)
            if (country.healthIndex < 15) crisisLevel = 3; // Urgence sanitaire (était 8)
            if (country.healthIndex < 8) crisisLevel = 4;  // Effondrement (était 3)

            // Vérifier si on peut déclencher une nouvelle crise
            if (crisisLevel > country.healthCrisisLevel) {
                // Limitation globale : pas plus de 3 crises simultanées
                if (currentHealthCrises >= MAX_SIMULTANEOUS_CRISES) return;

                // ✅ CONDITIONS DE DÉCLENCHEMENT AMÉLIORÉES
                // Vérifier la tendance (santé en baisse)
                const healthTrend = country.healthIndex - (country.previousHealthIndex || country.healthIndex);
                const isHealthDeclining = healthTrend < -0.5; // Seuil plus sensible (était -1)

                // Vérifier la durée dans le niveau actuel
                const ticksInLevel = country.ticksInCurrentHealthLevel || 0;
                const hasBeenInLevelLongEnough = ticksInLevel >= MIN_CRISIS_DURATION;

                // Probabilité de déclenchement basée sur la gravité
                const crisisProbability = crisisLevel >= 3 ? 0.8 : (crisisLevel >= 2 ? 0.4 : 0.2);
                const shouldTriggerByChance = Math.random() < crisisProbability;

                // Déclencher la crise si les conditions sont remplies
                if (isHealthDeclining || hasBeenInLevelLongEnough || shouldTriggerByChance) {
                    const {
                        title,
                        description,
                        baseEffects,
                        choices
                    } = createHealthCrisisAlert(t(country.name), crisisLevel, t);

                    let imageUrl = pickImage('DEFAULT');
                    if (crisisLevel === 1) imageUrl = pickImage('HEALTH_WARNING');
                    if (crisisLevel === 2) imageUrl = pickImage('HEALTH_CRISIS');
                    if (crisisLevel === 3) imageUrl = pickImage('HEALTH_EMERGENCY');
                    if (crisisLevel === 4) imageUrl = pickImage('HEALTH_COLLAPSE');

                    console.log('🏥 DEBUG Health Crisis - Level:', crisisLevel);
                    console.log('🏥 DEBUG Health Crisis - Cooldown OK:', ticksSinceLastCrisis);
                    console.log('🏥 DEBUG Health Crisis - Global limit OK:', currentHealthCrises);

                    setGameState(prev => ({
                        ...prev,
                        countries: prev.countries.map(c => c.id === country.id ? {
                            ...c,
                            healthCrisisLevel: crisisLevel,
                            healthCrisisLastTick: currentTick,
                            ticksInCurrentHealthLevel: 0 // Reset counter
                        } : c),
                        activeEvent: {
                            id: `health-${country.id}-${crisisLevel}`,
                            title,
                            description,
                            imageUrl,
                            choices,
                            baseEffects,
                        },
                        eventTimer: choices ? EVENT_TIMER_SECONDS : null,
                    }));

                    addToLog('logs.healthAlert', true, {countryName: t(country.name)});
                    return; // Une seule crise à la fois
                }
            }
        });
    }, [gameState.countries, gameState.playtimeSeconds, t, addToLog, gameState.activeEvent]);


    useEffect(() => {
        const checkConflicts = async () => {
            if (isGenerating || isPaused || gameState.isGameOver || gameState.activeEvent) return;

            const highInstabilityCountries = gameState.countries.filter(c => c.instability >= CONFLICT_INSTABILITY_THRESHOLD && !gameState.activeConflicts.some(con => con.involvedCountryIds.includes(c.id)));
            if (highInstabilityCountries.length >= 2) {
                setIsGenerating(true);
                const [c1, c2] = highInstabilityCountries.sort(() => 0.5 - Math.random());
                addToLog('logs.highTensions', true, {country1Name: t(c1.name), country2Name: t(c2.name)});
                const c1Context = `Region 1 (${t(c1.name)}) has high instability (${c1.instability.toFixed(0)}), and an energy deficit of ${Math.max(0, (c1.energy.consumption - (c1.energy.production.renewable + c1.energy.production.nuclear + c1.energy.production.thermal)) / c1.energy.consumption * 100).toFixed(0)}%.`;
                const c2Context = `Region 2 (${t(c2.name)}) has high instability (${c2.instability.toFixed(0)}), and an energy deficit of ${Math.max(0, (c2.energy.consumption - (c2.energy.production.renewable + c2.energy.production.nuclear + c2.energy.production.thermal)) / c2.energy.consumption * 100).toFixed(0)}%.`;
                const conflictContext = `${c1Context} ${c2Context}`;

                const conflictData = await generateConflictEvent(t(c1.name), t(c2.name), new Date(gameState.date).getFullYear(), language, conflictContext);

                if (conflictData) {
                    const newConflict: Conflict = {
                        id: `conflict-${Date.now()}`,
                        ...conflictData,
                        involvedCountryIds: [c1.id, c2.id],
                        startDate: new Date(gameState.date),
                    };
                    setGameState(prev => ({
                        ...prev,
                        activeEvent: {
                            id: `war-${newConflict.id}`,
                            title: conflictData.title,
                            description: newConflict.description,
                            imageUrl: IMAGES.WAR,
                            baseEffects: {},
                            isConflictDeclaration: true,
                            conflictDetails: newConflict,
                        }
                    }));
                } else {
                    addToLog('logs.tensionsDeescalated', true);
                }
                setIsGenerating(false);
            }
            setGameState(prev => ({...prev, ticksUntilConflictCheck: CONFLICT_CHECK_TICKS}));
        };
        if (gameState.ticksUntilConflictCheck <= 0) {
            checkConflicts();
        }
    }, [gameState.ticksUntilConflictCheck, gameState.countries, isGenerating, isPaused, language, t, addToLog, gameState.isGameOver, gameState.activeConflicts, gameState.activeEvent]);

    useEffect(() => {
        const checkExtinction = async () => {
            if (isGenerating || isPaused || gameState.isGameOver) return;

            const extinctionChance = (100 - gameState.biodiversityIndex) / 100 * 0.5;
            if (Math.random() < extinctionChance) {
                setIsGenerating(true);
                const causes = [
                    {name: t('cause.pollution'), weight: gameState.totalPollution},
                    {
                        name: t('cause.deforestation'),
                        weight: gameState.countries.reduce((s, c) => s + c.pollutants.deforestation, 0) / gameState.countries.length
                    },
                    {name: t('cause.globalWarming'), weight: gameState.globalWarming * 20},
                ];
                const dominantCause = causes.sort((a, b) => b.weight - a.weight)[0].name;
                const speciesData = await generateExtinctSpecies(dominantCause, language);
                if (speciesData) {
                    addToLog('logs.extinctionSuffix', true, {
                        speciesName: speciesData.speciesName,
                        cause: dominantCause
                    });
                }
                setIsGenerating(false);
            }
            setGameState(prev => ({...prev, ticksUntilExtinctionCheck: EXTINCTION_CHECK_TICKS}));
        };

        if (gameState.ticksUntilExtinctionCheck <= 0) {
            checkExtinction();
        }
    }, [gameState.ticksUntilExtinctionCheck, isGenerating, isPaused, language, t, addToLog, gameState.isGameOver, gameState.biodiversityIndex, gameState.totalPollution, gameState.globalWarming, gameState.countries]);

    useEffect(() => {
        if (!isPaused && gameHasStarted) {
            const threatIncrease = gameState.activeConflicts.length * 0.05 + (50 - gameState.publicSupport > 0 ? (50 - gameState.publicSupport) / 100 * 0.1 : 0);
            if (threatIncrease > 0) {
                setGameState(prev => ({
                    ...prev,
                    nuclearThreatLevel: Math.min(100, prev.nuclearThreatLevel + threatIncrease)
                }));
            }
        }
    }, [gameState.date, gameState.activeConflicts.length, gameState.publicSupport, isPaused, gameHasStarted]);

    useEffect(() => {
        const triggerNuclearEvent = async () => {
            if (isGenerating || isPaused || gameState.isGameOver || gameState.activeEvent) return;

            const strikeChance = (gameState.nuclearThreatLevel - 80) / 20 * 0.3;
            if (Math.random() < strikeChance) {
                setIsGenerating(true);
                const eventData = await generateNuclearEvent(language);
                if (eventData) {
                    setGameState(prev => {
                        const newCountries = prev.countries.map(c => {
                            if (eventData.targets.includes(c.id)) {
                                const popLoss = c.population * 0.15 * eventData.strikes;
                                const healthLoss = 25 * eventData.strikes;
                                return {
                                    ...c,
                                    population: Math.max(0, c.population - popLoss),
                                    healthIndex: Math.max(0, c.healthIndex - healthLoss)
                                };
                            }
                            return c;
                        });

                        return {
                            ...prev,
                            countries: newCountries,
                            biodiversityIndex: Math.max(0, prev.biodiversityIndex - 15 * eventData.strikes),
                            publicSupport: Math.max(0, prev.publicSupport - 20 * eventData.strikes),
                            nuclearThreatLevel: Math.max(0, prev.nuclearThreatLevel - 10),
                            activeEvent: {
                                id: `nuclear-${Date.now()}`,
                                title: t('nuclearStrike.title'),
                                description: eventData.description,
                                imageUrl: IMAGES.WAR,
                                baseEffects: {},
                                isNuclearStrike: true,
                                nuclearStrikeDetails: eventData,
                            }
                        };
                    });
                }
                setIsGenerating(false);
            }
        };
        if (gameState.nuclearThreatLevel > 80) {
            triggerNuclearEvent();
        }
    }, [gameState.nuclearThreatLevel, isGenerating, isPaused, gameState.isGameOver, language, t, gameState.activeEvent]);

    useEffect(() => {
        if (gameState.isGameOver) return;
        let gameOverReason: string | null = null;

        if (gameState.totalPollution >= 100) {
            gameOverReason = 'pollution';
        } else if (gameState.publicSupport <= 0) {
            gameOverReason = 'support';
        }
        const currentPopulation = gameState.countries.reduce((sum, c) => sum + c.population, 0);
        if (currentPopulation <= gameState.initialPopulation * POPULATION_GAMEOVER_THRESHOLD) {
            gameOverReason = 'population';
        }

        if (gameOverReason) {
            addToLog(`logs.gameOver.${gameOverReason}`, true);
            setGameState(prev => ({...prev, isGameOver: true, gameWon: false}));
            setIsPaused(true);
        } else if (gameState.totalPollution <= 10 && gameState.publicSupport >= 90) {
            addToLog('logs.gameOver.victory', true);
            setGameState(prev => ({...prev, isGameOver: true, gameWon: true}));
            setIsPaused(true);
        }
    }, [gameState, addToLog]);

    const selectedCountry = gameState.countries.find(c => c.id === gameState.selectedCountryId) || null;
    const isContinent = selectedCountry && selectedCountry.id.length === 2;
    const selectedRegion = isContinent ? selectedCountry.name : null;


    if (!ready) {
        return <InitializationLoader progress={0} message="Loading..."/>;
    }

    return (
        <div className="w-full max-w-full mx-auto p-1 sm:p-2 font-sans relative overflow-x-hidden">
            {isInitializing && <InitializationLoader progress={loaderStatus.progress} message={loaderStatus.message}/>}
            {gameState.isGameOver && <GameEndModal won={gameState.gameWon} onRestart={handleNewGame}/>}
            {isMenuOpen && <GameMenuModal onClose={() => handleMenuToggle(false)} onNewGame={handleNewGame}
                                          onSaveGame={handleSaveGame} onLoadGame={handleLoadGame} saveSlots={saveSlots}
                                          gameInProgress={gameHasStarted} currentLanguage={language}
                                          onLanguageChange={handleLanguageChange}
                                          hasPaidToRemoveAds={gameState.hasPaidToRemoveAds}
                                          onRemoveAds={handleRemoveAds}/>}
            {gameState.activeEvent &&
                <EventModal event={gameState.activeEvent} timer={gameState.eventTimer} ecoPoints={gameState.ecoPoints}
                            onChoice={handleEventChoice} onAcknowledge={handleCloseEvent}/>}
            {introModalData && <IntroModal narration={introModalData} onClose={handleCloseIntroModal}/>}
            {showInterstitial && <InterstitialAd onClose={handleCloseInterstitial}/>}

            <Header/>
            {!gameState.hasPaidToRemoveAds && <BannerAd/>}
            <main className="flex flex-col lg:grid lg:grid-cols-3 gap-2 mt-2 lg:flex-grow lg:min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-4 lg:min-h-0">
                    <MainControls gameState={gameState} onMenuToggle={() => handleMenuToggle(true)}
                               isPaused={isPaused} onPauseToggle={handlePauseToggle}
                               onSpeedChange={handleSpeedChange}/>
                    <div className="lg:flex-grow lg:min-h-0">
                        <WorldMap countries={gameState.countries} activeConflicts={gameState.activeConflicts}
                                  selectedCountryId={gameState.selectedCountryId}
                                  onSelectCountry={handleCountrySelect}/>
                    </div>
                    <InfoPanels gameState={gameState} selectedCountry={selectedCountry} selectedRegion={selectedRegion} />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-4 lg:min-h-0">
                    <ActionsPanel
                        ecoPoints={gameState.ecoPoints}
                        actions={ACTIONS}
                        onAction={handleAction}
                        onTechUpgrade={handleTechUpgrade}
                        disabled={isPaused || !!gameState.activeEvent || !gameHasStarted}
                        selectedCountry={selectedCountry}
                        activeActions={gameState.activeActions.filter(a => a.countryId === gameState.selectedCountryId)}
                        currentDate={gameState.date}
                    />
                    <EventLog events={eventLog}/>
                </div>
            </main>
        </div>
    );
};

export const App: React.FC = () => (
    <LocalizationProvider>
        <Game/>
    </LocalizationProvider>
);