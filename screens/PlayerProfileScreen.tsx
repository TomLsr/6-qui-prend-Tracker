import React, { useContext, useState, useEffect } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { calculatePlayerProfile } from '../services/statsService';
import PlayerAvatar from '../components/PlayerAvatar';
import StatCard from '../components/StatCard';
import { AVATARS } from '../constants';
import { Player } from '../types';

interface PlayerProfileScreenProps {
    playerId: string;
}

const PlayerProfileScreen: React.FC<PlayerProfileScreenProps> = ({ playerId }) => {
    const { players, games, setScreen, updatePlayer } = useContext(AppContext);
    const profile = calculatePlayerProfile(playerId, players, games);

    const [isEditing, setIsEditing] = useState(false);
    const [editedPseudo, setEditedPseudo] = useState('');
    const [editedAvatar, setEditedAvatar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (profile?.player) {
            setEditedPseudo(profile.player.pseudo);
            setEditedAvatar(profile.player.avatar);
        }
    }, [profile, isEditing]);


    if (!profile || !profile.player) {
        return <div>Joueur non trouvé.</div>;
    }
    
    const { 
        player, gamesPlayed, wins, winRate,
        avgScorePerGame, avgScorePerRound,
        bestScore, worstScore,
        nemesis, luckyCharm
    } = profile;

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        const trimmedPseudo = editedPseudo.trim();
        if (trimmedPseudo === '') {
            alert("Le pseudo ne peut pas être vide.");
            return;
        }

        const otherPlayers = players.filter(p => p.id !== player.id);
        if (otherPlayers.some(p => p.pseudo.toLowerCase() === trimmedPseudo.toLowerCase())) {
            alert("Ce pseudo est déjà utilisé par un autre joueur.");
            return;
        }
        
        setIsSubmitting(true);
        const updatedPlayerData: Player = {
            ...player,
            pseudo: trimmedPseudo,
            avatar: editedAvatar,
        };

        await updatePlayer(updatedPlayerData);
        setIsSubmitting(false);
        setIsEditing(false);
    };

    const hasChanges = editedPseudo.trim() !== player.pseudo || editedAvatar !== player.avatar;
    
    const renderEditForm = () => (
        <div className="bg-gray-800 p-6 rounded-lg space-y-6">
            <h3 className="text-2xl font-bold">Modifier le profil</h3>
            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1">
                    <p className="text-center font-semibold mb-2">Nouvel avatar :</p>
                    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                        {AVATARS.map(avatar => (
                            <div
                                key={avatar.id}
                                onClick={() => setEditedAvatar(avatar.id)}
                                className={`p-2 rounded-lg cursor-pointer border-2 ${editedAvatar === avatar.id ? 'border-orange-500 bg-gray-700' : 'border-transparent hover:bg-gray-600'}`}
                            >
                                <PlayerAvatar avatarId={avatar.id} className="w-full h-auto" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label htmlFor="pseudo" className="block text-sm font-medium text-gray-300 mb-2">Modifier le pseudo</label>
                        <input
                            id="pseudo"
                            type="text"
                            value={editedPseudo}
                            onChange={(e) => setEditedPseudo(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-2xl font-bold"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition">
                            Annuler
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSubmitting || !hasChanges}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderViewMode = () => (
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative">
            <PlayerAvatar avatarId={player.avatar} className="w-32 h-32"/>
            <div>
                <h2 className="text-4xl font-bold">{player.pseudo}</h2>
                <p className="text-gray-400">{player.isActive ? 'Actif' : 'Inactif'}</p>
            </div>
            <button 
                onClick={() => setIsEditing(true)} 
                className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition"
                aria-label="Modifier le joueur"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                </svg>
            </button>
        </div>
    );
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={() => setScreen(Screen.PLAYERS)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour aux joueurs
                </button>
            </div>
            
            {isEditing ? renderEditForm() : renderViewMode()}

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