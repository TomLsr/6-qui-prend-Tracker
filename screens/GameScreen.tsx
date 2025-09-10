
import React, { useState, useContext, useMemo } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { Game, Round } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

interface GameScreenProps {
    game: Game;
    setGame: React.Dispatch<React.SetStateAction<Game | null>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ game, setGame }) => {
    const { players, addGame, setScreen, setActiveGame, setSelectedGame } = useContext(AppContext);
    const [currentScores, setCurrentScores] = useState<Round>(
        game.playerIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
    );

    const gamePlayers = useMemo(() => {
        return players.filter(p => game.playerIds.includes(p.id));
    }, [players, game.playerIds]);

    const handleScoreChange = (playerId: string, score: string) => {
        const newScore = parseInt(score, 10);
        if (!isNaN(newScore) || score === '') {
            setCurrentScores(prev => ({ ...prev, [playerId]: isNaN(newScore) ? 0 : newScore }));
        }
    };

    const handleAddRound = () => {
        const newGame = { ...game };
        newGame.rounds.push(currentScores);
        
        const newTotals: { [playerId: string]: number } = {};
        game.playerIds.forEach(id => {
            newTotals[id] = (game.totals[id] || 0) + (currentScores[id] || 0);
        });
        newGame.totals = newTotals;

        setGame(newGame);
        setCurrentScores(game.playerIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}));
    };

    const handleEndGame = () => {
        let finalGame = { ...game };
        
        // Add current round if not empty
        if (Object.values(currentScores).some(s => s > 0)) {
            finalGame.rounds.push(currentScores);
            const newTotals: { [playerId: string]: number } = {};
            finalGame.playerIds.forEach(id => {
                newTotals[id] = (finalGame.totals[id] || 0) + (currentScores[id] || 0);
            });
            finalGame.totals = newTotals;
        }

        let minScore = Infinity;
        let maxScore = -Infinity;
        let winnerId: string | undefined = undefined;
        let loserId: string | undefined = undefined;

        finalGame.playerIds.forEach(id => {
            const total = finalGame.totals[id];
            if (total < minScore) {
                minScore = total;
                winnerId = id;
            }
            if (total > maxScore) {
                maxScore = total;
                loserId = id;
            }
        });

        finalGame.winnerId = winnerId;
        finalGame.loserId = loserId;

        addGame(finalGame);
        setSelectedGame(finalGame);
        setActiveGame(null);
        setScreen(Screen.GAME_SUMMARY);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Partie en cours</h2>
            
            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <table className="w-full min-w-max text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3">Manche</th>
                            {gamePlayers.map(player => (
                                <th key={player.id} className="p-3 text-center">
                                    <PlayerAvatar avatarId={player.avatar} className="w-10 h-10 mx-auto mb-1" />
                                    {player.pseudo}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {game.rounds.map((round, index) => (
                            <tr key={index} className="border-b border-gray-700">
                                <td className="p-3 font-semibold">Manche {index + 1}</td>
                                {gamePlayers.map(player => (
                                    <td key={player.id} className="p-3 text-center text-lg">{round[player.id] || 0}</td>
                                ))}
                            </tr>
                        ))}
                        <tr className="bg-gray-900">
                            <td className="p-3 font-bold text-orange-400">Total</td>
                            {gamePlayers.map(player => (
                                <td key={player.id} className="p-3 text-center font-bold text-2xl text-orange-400">
                                    {game.totals[player.id] || 0}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-gray-700">
                             <td className="p-3 font-semibold">Nouvelle Manche</td>
                            {gamePlayers.map(player => (
                                <td key={player.id} className="p-3 text-center">
                                    <input
                                        type="number"
                                        value={currentScores[player.id] || ''}
                                        onChange={e => handleScoreChange(player.id, e.target.value)}
                                        className="w-20 bg-gray-800 text-white p-2 rounded-md text-center"
                                        placeholder="0"
                                    />
                                </td>
                            ))}
                        </tr>
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
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    Terminer la partie
                </button>
            </div>
        </div>
    );
};

export default GameScreen;
