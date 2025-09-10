import React, { useState, useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { Player } from '../types';
import { AVATARS } from '../constants';
import Modal from '../components/Modal';
import PlayerAvatar from '../components/PlayerAvatar';

const PlayersScreen: React.FC = () => {
    const { players, addPlayer, updatePlayer, deletePlayer, setScreen, setSelectedPlayerId } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPseudo, setNewPseudo] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);

    const handleAddPlayer = () => {
        if (newPseudo.trim() === '' || players.some(p => p.pseudo.toLowerCase() === newPseudo.trim().toLowerCase())) {
            alert("Le pseudo ne peut pas être vide et doit être unique.");
            return;
        }
        const newPlayer: Player = {
            id: Date.now().toString(),
            pseudo: newPseudo.trim(),
            avatar: selectedAvatar,
            isActive: true,
        };
        addPlayer(newPlayer);
        setNewPseudo('');
        setSelectedAvatar(AVATARS[0].id);
        setIsModalOpen(false);
    };
    
    const togglePlayerStatus = (player: Player) => {
        updatePlayer({ ...player, isActive: !player.isActive });
    };

    const handleDeletePlayer = (player: Player) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${player.pseudo} ? Cette action est irréversible.`)) {
            deletePlayer(player.id);
        }
    }

    const viewProfile = (playerId: string) => {
        setSelectedPlayerId(playerId);
        setScreen(Screen.PLAYER_PROFILE);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Gestion des Joueurs</h2>
                <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>
            
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mb-6 transition"
            >
                + Ajouter un joueur
            </button>

            <div className="bg-gray-800 rounded-lg shadow-lg">
                <ul className="divide-y divide-gray-700">
                    {players.map(player => (
                        <li key={player.id} className={`p-4 flex items-center justify-between ${!player.isActive ? 'opacity-50' : ''}`}>
                            <div className="flex items-center cursor-pointer flex-grow" onClick={() => viewProfile(player.id)}>
                                <PlayerAvatar avatarId={player.avatar} className="w-12 h-12 mr-4"/>
                                <span className="font-semibold text-lg">{player.pseudo}</span>
                            </div>
                            <div className="flex items-center">
                               <span className={`mr-4 text-sm font-bold ${player.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                   {player.isActive ? 'Actif' : 'Inactif'}
                               </span>
                                <button onClick={() => togglePlayerStatus(player)} className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${player.isActive ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    <div className={`w-6 h-6 rounded-full bg-white transform transition-transform duration-300 ${player.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                                <button 
                                    onClick={() => handleDeletePlayer(player)} 
                                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full"
                                    aria-label={`Supprimer ${player.pseudo}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un joueur">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newPseudo}
                        onChange={(e) => setNewPseudo(e.target.value)}
                        placeholder="Pseudo"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p>Choisir un avatar :</p>
                    <div className="grid grid-cols-4 gap-4">
                        {AVATARS.map(avatar => (
                            <div
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={`p-2 rounded-lg cursor-pointer border-2 ${selectedAvatar === avatar.id ? 'border-orange-500 bg-gray-700' : 'border-transparent hover:bg-gray-600'}`}
                            >
                                <PlayerAvatar avatarId={avatar.id} className="w-full h-auto" />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddPlayer} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">
                        Valider
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PlayersScreen;