
import React, { useContext, useMemo } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { GameData } from '../types';
import PlayerAvatar from '../components/PlayerAvatar';

interface GameSummaryScreenProps {
    game: GameData;
}

const GameSummaryScreen: React.FC<GameSummaryScreenProps> = ({ game }) => {
    const { setScreen, setSelectedGame } = useContext(AppContext);

    const winnerParticipant = useMemo(() => game.participants.find(p => p.player.id === game.winner_id), [game]);
    const loserParticipant = useMemo(() => game.participants.find(p => p.player.id === game.loser_id), [game]);
    
    const gamePlayersSorted = useMemo(() => {
        return [...game.participants].sort((a, b) => a.score - b.score);
    }, [game.participants]);

    const handleClose = () => {
        setSelectedGame(null);
        setScreen(Screen.HOME);
    };

    return (
        <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold">Résumé de la Partie</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {winnerParticipant && (
                    <div className="bg-green-800 bg-opacity-30 p-6 rounded-lg border-2 border-green-500">
                        <h3 className="text-2xl font-bold text-green-400 mb-4">🏆 GAGNANT 🏆</h3>
                        <PlayerAvatar avatarId={winnerParticipant.player.avatar} className="w-24 h-24 mx-auto mb-2"/>
                        <p className="text-3xl font-bold">{winnerParticipant.player.pseudo}</p>
                        <p className="text-xl text-gray-300">Score: <span className="font-bold text-white">{winnerParticipant.score}</span></p>
                    </div>
                )}
                {loserParticipant && (
                    <div className="bg-red-800 bg-opacity-30 p-6 rounded-lg border-2 border-red-500">
                        <h3 className="text-2xl font-bold text-red-400 mb-4">🐮 PERDANT 🐮</h3>
                        <PlayerAvatar avatarId={loserParticipant.player.avatar} className="w-24 h-24 mx-auto mb-2"/>
                        <p className="text-3xl font-bold">{loserParticipant.player.pseudo}</p>
                        <p className="text-xl text-gray-300">Score: <span className="font-bold text-white">{loserParticipant.score}</span></p>
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
