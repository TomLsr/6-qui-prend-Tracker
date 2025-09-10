
import React, { useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { calculatePlayerProfile } from '../services/statsService';
import PlayerAvatar from '../components/PlayerAvatar';
import StatCard from '../components/StatCard';

interface PlayerProfileScreenProps {
    playerId: string;
}

const PlayerProfileScreen: React.FC<PlayerProfileScreenProps> = ({ playerId }) => {
    const { players, games, setScreen } = useContext(AppContext);
    const profile = calculatePlayerProfile(playerId, players, games);

    if (!profile || !profile.player) {
        return <div>Joueur non trouvé.</div>;
    }
    
    const { 
        player, gamesPlayed, wins, winRate,
        avgScorePerGame, avgScorePerRound,
        bestScore, worstScore,
        nemesis, luckyCharm
    } = profile;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={() => setScreen(Screen.PLAYERS)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour aux joueurs
                </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <PlayerAvatar avatarId={player.avatar} className="w-32 h-32"/>
                <div>
                    <h2 className="text-4xl font-bold">{player.pseudo}</h2>
                    <p className="text-gray-400">{player.isActive ? 'Actif' : 'Inactif'}</p>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-4">Statistiques de performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <StatCard label="Parties Jouées" value={gamesPlayed} />
                    <StatCard label="Victoires" value={wins} />
                    <StatCard label="Taux de Victoire" value={`${winRate.toFixed(1)}%`} />
                    <StatCard label="Score Moyen / Partie" value={avgScorePerGame.toFixed(2)} />
                    <StatCard label="Score Moyen / Manche" value={avgScorePerRound.toFixed(2)} />
                    <StatCard label="Meilleur Score" value={bestScore ?? 'N/A'} />
                    <StatCard label="Pire Score" value={worstScore ?? 'N/A'} />
                </div>
            </div>
            
            <div>
                 <h3 className="text-2xl font-bold mb-4">Statistiques Amusantes</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nemesis ? (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-400">Bête Noire 😈</h4>
                            <div className="flex items-center mt-2">
                               <PlayerAvatar avatarId={nemesis.avatar} className="w-10 h-10 mr-3" />
                               <p className="text-lg">{nemesis.pseudo}</p>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-gray-800 p-4 rounded-lg text-gray-500">
                            <h4 className="font-semibold">Bête Noire 😈</h4>
                            <p>Pas encore de données</p>
                        </div>
                    )}
                    {luckyCharm ? (
                         <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-400">Porte-Bonheur 🍀</h4>
                             <div className="flex items-center mt-2">
                               <PlayerAvatar avatarId={luckyCharm.avatar} className="w-10 h-10 mr-3" />
                               <p className="text-lg">{luckyCharm.pseudo}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-4 rounded-lg text-gray-500">
                            <h4 className="font-semibold">Porte-Bonheur 🍀</h4>
                            <p>Pas encore de données</p>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default PlayerProfileScreen;
