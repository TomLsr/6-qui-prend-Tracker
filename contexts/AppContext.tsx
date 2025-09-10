import React, { createContext, useState, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Player, Game } from '../types';

export enum Screen {
    HOME,
    PLAYERS,
    NEW_GAME,
    GAME,
    GAME_SUMMARY,
    LEADERBOARD,
    PLAYER_PROFILE,
    HALL_OF_FAME,
    HISTORY,
}

interface AppContextType {
    screen: Screen;
    setScreen: (screen: Screen) => void;
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    games: Game[];
    setGames: React.Dispatch<React.SetStateAction<Game[]>>;
    addPlayer: (player: Player) => void;
    updatePlayer: (updatedPlayer: Player) => void;
    deletePlayer: (playerId: string) => void;
    addGame: (game: Game) => void;
    activeGame: Game | null;
    setActiveGame: React.Dispatch<React.SetStateAction<Game | null>>;
    selectedPlayerId: string | null;
    setSelectedPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
    selectedGame: Game | null;
    setSelectedGame: React.Dispatch<React.SetStateAction<Game | null>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [screen, setScreen] = useState<Screen>(Screen.HOME);
    const [players, setPlayers] = useLocalStorage<Player[]>('players', []);
    const [games, setGames] = useLocalStorage<Game[]>('games', []);
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);


    const addPlayer = (player: Player) => {
        setPlayers(prev => [...prev, player]);
    };
    
    const updatePlayer = (updatedPlayer: Player) => {
        setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    };

    const deletePlayer = (playerId: string) => {
        const playerHasGames = games.some(game => game.playerIds.includes(playerId));
        if (playerHasGames) {
            alert("Impossible de supprimer un joueur qui a déjà participé à des parties. Vous pouvez le rendre inactif à la place.");
            return;
        }
        setPlayers(prev => prev.filter(p => p.id !== playerId));
    };

    const addGame = (game: Game) => {
        setGames(prev => [game, ...prev]);
    };

    const contextValue: AppContextType = {
        screen,
        setScreen,
        players,
        setPlayers,
        games,
        setGames,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addGame,
        activeGame,
        setActiveGame,
        selectedPlayerId,
        setSelectedPlayerId,
        selectedGame,
        setSelectedGame,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};