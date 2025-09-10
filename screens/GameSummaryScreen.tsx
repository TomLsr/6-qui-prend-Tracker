
import React, { useContext, useMemo } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { Game } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

interface GameSummaryScreenProps {
    game: Game;
}

const GameSummaryScreen: React.FC<GameSummaryScreenProps> = ({ game }) => {
    const { players, setScreen, setSelectedGame } = useContext(AppContext);

    const winner = useMemo(() => game.winnerId ? players.find(p => p.id === game.winnerId) : null, [players, game.winnerId]);
    const loser = useMemo(() => game.loserId ? players.find(p => p.id === game.loserId) : null, [players, game.loserId]);

    const gamePlayersSorted = useMemo(() => {
        return game.playerIds
            .map(id => ({ player: players.find(p => p.id === id), score: game.totals[id] }))
            .filter(item => item.player)
            .sort((a, b) => a.score - b.score);
    }, [players, game.playerIds, game.totals]);

    const handleClose = () => {
        setSelectedGame(null);
        setScreen(Screen.HOME);
    };

    return (
        <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold">Résumé de la Partie</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {winner && (
                    <div className="bg-green-800 bg-opacity-30 p-6 rounded-lg border-2 border-green-500">
                        <h3 className="text-2xl font-bold text-green-400 mb-4">🏆 GAGNANT 🏆</h3>
                        <PlayerAvatar avatarId={winner.avatar} className="w-24 h-24 mx-auto mb-2"/>
                        <p className="text-3xl font-bold">{winner.pseudo}</p>
                        <p className="text-xl text-gray-300">Score: <span className="font-bold text-white">{game.totals[winner.id]}</span></p>
                    </div>
                )}
                {loser && (
                    <div className="bg-red-800 bg-opacity-30 p-6 rounded-lg border-2 border-red-500">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">🐮 PERDANT 🐮</h3>
                        <PlayerAvatar avatarId={loser.avatar} className="w-24 h-24 mx-auto mb-2"/>
                        <p className="text-3xl font-bold">{loser.pseudo}</p>
                        <p className="text-xl text-gray-300">Score: <span className="font-bold text-white">{game.totals[loser.id]}</span></p>
                    </div>
                )}
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Scores Finaux</h3>
                <ul className="space-y-3">
                    {gamePlayersSorted.map(({ player, score }, index) => (
                       player && <li key={player.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                           <div className="flex items-center">
                               <span className="text-lg font-bold w-8">{index + 1}.</span>
                               <PlayerAvatar avatarId={player.avatar} className="w-8 h-8 mr-3" />
                               <span className="text-lg">{player.pseudo}</span>
                           </div>
                           <span className="text-xl font-bold">{score}</span>
                       </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={handleClose}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition text-lg"
            >
                Fermer
            </button>
        </div>
    );
};

export default GameSummaryScreen;
