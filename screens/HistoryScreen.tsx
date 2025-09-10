
import React, { useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { GameData } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

const HistoryScreen: React.FC = () => {
    const { games, players, setScreen, setSelectedGame } = useContext(AppContext);
    
    const viewGameSummary = (game: GameData) => {
        setSelectedGame(game);
        setScreen(Screen.GAME_SUMMARY);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Historique des Parties</h2>
                 <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>
            
            {games.length === 0 ? (
                <p className="text-center text-gray-400 mt-12">Aucune partie n'a encore été jouée.</p>
            ) : (
                <div className="space-y-4">
                    {games.map(game => {
                        const winner = players.find(p => p.id === game.winner_id);

                        return (
                            <div 
                                key={game.id} 
                                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700/50 transition-colors"
                                onClick={() => viewGameSummary(game)}
                            >
                                <div>
                                    <p className="font-bold text-lg">{new Date(game.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    <div className="flex flex-wrap items-center mt-2 gap-2">
                                        {game.participants.map(({ player }) => (
                                            <div key={player.id} className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                                                <PlayerAvatar avatarId={player.avatar} className="w-5 h-5 mr-2" />
                                                <span className="text-sm">{player.pseudo}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Gagnant</p>
                                    {winner ? (
                                        <div className="flex items-center justify-end">
                                            <span className="font-semibold mr-2">{winner.pseudo}</span>
                                            <PlayerAvatar avatarId={winner.avatar} className="w-8 h-8"/>
                                        </div>
                                    ) : (
                                        <p>N/A</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryScreen;
