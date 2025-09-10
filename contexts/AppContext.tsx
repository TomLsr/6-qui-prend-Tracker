import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Player, Game } from '../types';
import { supabase } from '../services/supabaseClient';

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
    addPlayer: (playerData: Omit<Player, 'id'>) => Promise<void>;
    updatePlayer: (updatedPlayer: Player) => Promise<void>;
    deletePlayer: (playerId: string) => Promise<void>;
    addGame: (gameData: Omit<Game, 'id'>) => Promise<Game | null>;
    activeGame: Game | null;
    setActiveGame: React.Dispatch<React.SetStateAction<Game | null>>;
    selectedPlayerId: string | null;
    setSelectedPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
    selectedGame: Game | null;
    setSelectedGame: React.Dispatch<React.SetStateAction<Game | null>>;
    loading: boolean;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [screen, setScreen] = useState<Screen>(Screen.HOME);
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: playersData, error: playersError } = await supabase.from('players').select('*');
                if (playersError) throw playersError;
                setPlayers(playersData || []);

                const { data: gamesData, error: gamesError } = await supabase.from('games').select('*').order('date', { ascending: false });
                if (gamesError) throw gamesError;
                setGames(gamesData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const addPlayer = async (playerData: Omit<Player, 'id'>) => {
        try {
            const { data, error } = await supabase.from('players').insert([playerData]).select();
            if (error) throw error;
            if (data) {
                setPlayers(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error('Error adding player:', error);
            alert('Erreur lors de l\'ajout du joueur.');
        }
    };
    
    const updatePlayer = async (updatedPlayer: Player) => {
        try {
            const { data, error } = await supabase.from('players').update(updatedPlayer).eq('id', updatedPlayer.id).select();
            if (error) throw error;
            if (data) {
                setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? data[0] : p));
            }
        } catch (error) {
            console.error('Error updating player:', error);
            alert('Erreur lors de la mise à jour du joueur.');
        }
    };

    const deletePlayer = async (playerId: string) => {
        const playerHasGames = games.some(game => game.playerIds.includes(playerId));
        if (playerHasGames) {
            alert("Impossible de supprimer un joueur qui a déjà participé à des parties. Vous pouvez le rendre inactif à la place.");
            return;
        }
        
        try {
            const { error } = await supabase.from('players').delete().eq('id', playerId);
            if (error) throw error;
            setPlayers(prev => prev.filter(p => p.id !== playerId));
        } catch (error) {
            console.error('Error deleting player:', error);
            alert('Erreur lors de la suppression du joueur.');
        }
    };

    const addGame = async (gameData: Omit<Game, 'id'>): Promise<Game | null> => {
        try {
            const { data, error } = await supabase.from('games').insert([gameData]).select();
            if (error) throw error;
            if (data && data[0]) {
                const newGame = data[0];
                setGames(prev => [newGame, ...prev]);
                return newGame;
            }
            return null;
        } catch(error) {
            console.error('Error adding game:', error);
            alert('Erreur lors de l\'enregistrement de la partie.');
            return null;
        }
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
        loading,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};