import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameData, GameParticipant } from '../types';
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

interface NewGameData {
    date: string;
    participants: {
        player_id: string;
        score: number;
        is_winner: boolean;
        is_loser: boolean;
    }[];
    winner_id?: string;
    loser_id?: string;
}

interface AppContextType {
    screen: Screen;
    setScreen: (screen: Screen) => void;
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    games: GameData[];
    setGames: React.Dispatch<React.SetStateAction<GameData[]>>;
    addPlayer: (playerData: Omit<Player, 'id'>) => Promise<Player | null>;
    updatePlayer: (updatedPlayer: Player) => Promise<void>;
    deletePlayer: (playerId: string) => Promise<void>;
    addGame: (gameData: NewGameData) => Promise<GameData | null>;
    activeGame: GameData | null;
    setActiveGame: React.Dispatch<React.SetStateAction<GameData | null>>;
    selectedPlayerId: string | null;
    setSelectedPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
    selectedGame: GameData | null;
    setSelectedGame: React.Dispatch<React.SetStateAction<GameData | null>>;
    loading: boolean;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [screen, setScreen] = useState<Screen>(Screen.HOME);
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<GameData[]>([]);
    const [activeGame, setActiveGame] = useState<GameData | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: playersData, error: playersError } = await supabase.from('players').select('*');
                if (playersError) throw playersError;
                setPlayers(playersData || []);

                // Fetch games with related players
                const { data: gamesData, error: gamesError } = await supabase
                    .from('games')
                    .select('*, game_players(*, players(*))')
                    .order('date', { ascending: false });
                
                if (gamesError) throw gamesError;

                // FIX: Cast gamesData to any to handle complex join type from Supabase
                const formattedGames: GameData[] = (gamesData as any[])?.map(game => {
                    const participants: GameParticipant[] = game.game_players.map((gp: any) => ({
                        player: gp.players,
                        score: gp.score,
                        is_winner: gp.is_winner,
                        is_loser: gp.is_loser
                    })).filter((p: {player: any}) => p.player); // Filter out potential null players

                    return {
                        id: game.id,
                        date: game.date,
                        winner_id: game.winner_id,
                        loser_id: game.loser_id,
                        participants,
                    };
                });
                
                setGames(formattedGames || []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const addPlayer = async (playerData: Omit<Player, 'id'>): Promise<Player | null> => {
        try {
            const { data, error } = await supabase.from('players').insert([playerData]).select();
            if (error) throw error;
            if (data && data[0]) {
                setPlayers(prev => [...prev, ...data]);
                return data[0];
            }
            return null;
        } catch (error) {
            console.error('Error adding player:', error);
            alert('Erreur lors de l\'ajout du joueur.');
            return null;
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
        const playerHasGames = games.some(game => game.participants.some(p => p.player.id === playerId));
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

    const addGame = async (gameData: NewGameData): Promise<GameData | null> => {
        try {
            // 1. Insert the game to get an ID
            const { data: gameResult, error: gameError } = await supabase
                .from('games')
                .insert([{ date: gameData.date, winner_id: gameData.winner_id, loser_id: gameData.loser_id }])
                .select()
                .single();

            if (gameError) throw gameError;

            // FIX: Handle the case where gameResult can be null.
            if (!gameResult) {
                console.error("Failed to create game.");
                return null;
            }
            const newGameId = gameResult.id;

            // 2. Insert each participant into game_players
            const gamePlayersToInsert = gameData.participants.map(p => ({
                game_id: newGameId,
                player_id: p.player_id,
                score: p.score,
                is_winner: p.is_winner,
                is_loser: p.is_loser,
            }));

            const { error: gamePlayersError } = await supabase.from('game_players').insert(gamePlayersToInsert);
            if (gamePlayersError) throw gamePlayersError;

            // 3. Construct the full GameData object to return and update state
            const participantsWithPlayers: GameParticipant[] = gameData.participants.map(p => ({
                player: players.find(player => player.id === p.player_id)!,
                score: p.score,
                is_winner: p.is_winner,
                is_loser: p.is_loser,
            }));

            const newGame: GameData = {
                id: newGameId,
                date: gameData.date,
                winner_id: gameData.winner_id,
                loser_id: gameData.loser_id,
                participants: participantsWithPlayers,
            };

            setGames(prev => [newGame, ...prev]);
            return newGame;

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
