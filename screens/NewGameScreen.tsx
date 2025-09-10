
import React, { useState, useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { Player, Game } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

const NewGameScreen: React.FC = () => {
    const { players, setActiveGame, setScreen } = useContext(AppContext);
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
    const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0]);

    const activePlayers = players.filter(p => p.isActive);

    const togglePlayerSelection = (playerId: string) => {
        setSelectedPlayerIds(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleStartGame = () => {
        if (selectedPlayerIds.length < 2) {
            alert('Veuillez sélectionner au moins 2 joueurs.');
            return;
        }

        const newGame: Game = {
            id: Date.now().toString(),
            date: gameDate,
            playerIds: selectedPlayerIds,
            rounds: [],
            totals: selectedPlayerIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
        };

        setActiveGame(newGame);
        setScreen(Screen.GAME);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Nouvelle Partie</h2>
                 <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg space-y-6">
                <div>
                    <label htmlFor="gameDate" className="block text-sm font-medium text-gray-300 mb-2">Date de la partie</label>
                    <input
                        type="date"
                        id="gameDate"
                        value={gameDate}
                        onChange={(e) => setGameDate(e.target.value)}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Sélectionner les joueurs</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {activePlayers.map(player => (
                            <div
                                key={player.id}
                                onClick={() => togglePlayerSelection(player.id)}
                                className={`p-4 rounded-lg cursor-pointer border-2 flex flex-col items-center justify-center transition-all ${
                                    selectedPlayerIds.includes(player.id)
                                        ? 'border-orange-500 bg-gray-700'
                                        : 'border-transparent bg-gray-900 hover:bg-gray-700'
                                }`}
                            >
                                <PlayerAvatar avatarId={player.avatar} className="w-16 h-16 mb-2" />
                                <p className="font-semibold text-center">{player.pseudo}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleStartGame}
                    disabled={selectedPlayerIds.length < 2}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Démarrer la partie ({selectedPlayerIds.length} joueurs)
                </button>
            </div>
        </div>
    );
};

export default NewGameScreen;
