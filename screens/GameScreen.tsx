import React, { useState, useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { GameData } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

interface GameScreenProps {
    game: GameData;
    setGame: React.Dispatch<React.SetStateAction<GameData | null>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ game, setGame }) => {
    const { addGame, setScreen, setActiveGame, setSelectedGame } = useContext(AppContext);
    
    // Tracks scores for the current round being entered
    const [currentRoundScores, setCurrentRoundScores] = useState<{ [playerId: string]: number }>(
        game.participants.reduce((acc, p) => ({ ...acc, [p.player.id]: 0 }), {})
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleScoreChange = (playerId: string, score: string) => {
        const newScore = parseInt(score, 10);
        setCurrentRoundScores(prev => ({ ...prev, [playerId]: isNaN(newScore) ? 0 : newScore }));
    };

    const handleAddRound = () => {
        const updatedParticipants = game.participants.map(p => ({
            ...p,
            score: p.score + (currentRoundScores[p.player.id] || 0),
        }));

        setGame({ ...game, participants: updatedParticipants });
        
        // Reset round scores
        setCurrentRoundScores(game.participants.reduce((acc, p) => ({ ...acc, [p.player.id]: 0 }), {}));
    };

    const handleEndGame = async () => {
        setIsSaving(true);
        let finalGame = { ...game };

        // Add current round scores if they haven't been added yet
        if (Object.values(currentRoundScores).some(s => s > 0)) {
            const updatedParticipants = finalGame.participants.map(p => ({
                ...p,
                score: p.score + (currentRoundScores[p.player.id] || 0),
            }));
            finalGame.participants = updatedParticipants;
        }

        let minScore = Infinity;
        let maxScore = -Infinity;
        let winnerId: string | undefined = undefined;
        let loserId: string | undefined = undefined;

        finalGame.participants.forEach(p => {
            if (p.score < minScore) {
                minScore = p.score;
                winnerId = p.player.id;
            }
            if (p.score > maxScore) {
                maxScore = p.score;
                loserId = p.player.id;
            }
        });

        const participantsData = finalGame.participants.map(p => ({
            player_id: p.player.id,
            score: p.score,
            is_winner: p.player.id === winnerId,
            is_loser: p.player.id === loserId,
        }));

        const savedGame = await addGame({
            date: finalGame.date,
            participants: participantsData,
            winner_id: winnerId,
            loser_id: loserId,
        });
        
        if (savedGame) {
            setSelectedGame(savedGame);
            setActiveGame(null);
            setScreen(Screen.GAME_SUMMARY);
        } else {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Partie en cours</h2>
            
            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <table className="w-full min-w-max text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3">Joueur</th>
                            <th className="p-3 text-center">Score Total</th>
                            <th className="p-3 text-center">Ajouter Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {game.participants.map(p => (
                            <tr key={p.player.id} className="border-b border-gray-700">
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <PlayerAvatar avatarId={p.player.avatar} className="w-10 h-10 mr-3" />
                                        <span className="font-semibold">{p.player.pseudo}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center font-bold text-2xl text-orange-400">
                                    {p.score}
                                </td>
                                <td className="p-3 text-center">
                                     <input
                                        type="number"
                                        value={currentRoundScores[p.player.id] || ''}
                                        onChange={e => handleScoreChange(p.player.id, e.target.value)}
                                        className="w-24 bg-gray-700 text-white p-2 rounded-md text-center"
                                        placeholder="0"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleAddRound}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    Valider la manche
                </button>
                <button
                    onClick={handleEndGame}
                    disabled={isSaving}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-500"
                >
                    {isSaving ? 'Enregistrement...' : 'Terminer la partie'}
                </button>
            </div>
        </div>
    );
};

export default GameScreen;
