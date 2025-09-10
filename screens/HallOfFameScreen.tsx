
import React, { useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { calculateHallOfFame } from '../services/statsService';
import PlayerAvatar from '../components/PlayerAvatar';

const HallOfFameScreen: React.FC = () => {
    const { players, games, setScreen, setSelectedPlayerId } = useContext(AppContext);
    const { king, collector, metronome } = calculateHallOfFame(players, games);

    const viewProfile = (playerId: string) => {
        setSelectedPlayerId(playerId);
        setScreen(Screen.PLAYER_PROFILE);
    };

    const TrophyCard: React.FC<{
        emoji: string;
        title: string;
        data: { player: { id: string, avatar: string, pseudo: string }, value: string | number } | null;
        bgColor: string;
    }> = ({ emoji, title, data, bgColor }) => (
        <div className={`${bgColor} p-6 rounded-lg shadow-lg text-center`}>
            <p className="text-5xl mb-4">{emoji}</p>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            {data ? (
                <div 
                    className="flex flex-col items-center cursor-pointer" 
                    onClick={() => viewProfile(data.player.id)}
                >
                    <PlayerAvatar avatarId={data.player.avatar} className="w-16 h-16 mb-2" />
                    <p className="text-2xl font-semibold">{data.player.pseudo}</p>
                    <p className="text-lg text-gray-200">{data.value}</p>
                </div>
            ) : (
                <p className="text-gray-400">Pas de données</p>
            )}
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Palmarès & Trophées</h2>
                <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TrophyCard 
                    emoji="👑" 
                    title="Le Roi du 6 qui prend" 
                    data={king ? { player: king.player, value: `${king.wins} victoires` } : null}
                    bgColor="bg-yellow-600 bg-opacity-40"
                />
                <TrophyCard 
                    emoji="🐮" 
                    title="Le Collectionneur de Bœufs" 
                    data={collector ? { player: collector.player, value: `${collector.points} points` } : null}
                    bgColor="bg-red-600 bg-opacity-40"
                />
                <TrophyCard 
                    emoji="⏱️" 
                    title="Le Métronome" 
                    data={metronome ? { player: metronome.player, value: `${metronome.score.toFixed(2)} / manche` } : null}
                    bgColor="bg-blue-600 bg-opacity-40"
                />
            </div>
        </div>
    );
};

export default HallOfFameScreen;
