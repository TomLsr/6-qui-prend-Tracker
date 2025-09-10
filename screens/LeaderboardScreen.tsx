
import React, { useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { calculateLeaderboard } from '../services/statsService';
import PlayerAvatar from '../components/PlayerAvatar';

const LeaderboardScreen: React.FC = () => {
    const { players, games, setScreen, setSelectedPlayerId } = useContext(AppContext);
    const leaderboardData = calculateLeaderboard(players, games);
    
    const viewProfile = (playerId: string) => {
        setSelectedPlayerId(playerId);
        setScreen(Screen.PLAYER_PROFILE);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Classement Général</h2>
                 <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>
            
            <p className="text-gray-400 mb-6">Le classement est basé sur le score moyen par manche (le plus bas est le meilleur).</p>
            
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4 font-semibold w-16 text-center">Rang</th>
                            <th className="p-4 font-semibold">Joueur</th>
                            <th className="p-4 font-semibold text-center">Score Moyen / Manche</th>
                            <th className="p-4 font-semibold text-center">Parties Jouées</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((data, index) => (
                            <tr key={data.player.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 text-center font-bold text-xl">
                                    {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center cursor-pointer" onClick={() => viewProfile(data.player.id)}>
                                        <PlayerAvatar avatarId={data.player.avatar} className="w-10 h-10 mr-4"/>
                                        <span className="font-semibold">{data.player.pseudo}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center font-bold text-lg text-orange-400">{data.avgScorePerRound.toFixed(2)}</td>
                                <td className="p-4 text-center">{data.gamesPlayed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardScreen;
