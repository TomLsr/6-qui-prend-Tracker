import React, { useContext } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';

const HomeScreen: React.FC = () => {
    const { setScreen } = useContext(AppContext);

    const menuItems = [
        { label: 'Nouvelle Partie', screen: Screen.NEW_GAME, icon: '🎮' },
        { label: 'Classement', screen: Screen.LEADERBOARD, icon: '🏆' },
        { label: 'Joueurs', screen: Screen.PLAYERS, icon: '👥' },
        { label: 'Palmarès', screen: Screen.HALL_OF_FAME, icon: '🏅' },
        { label: 'Historique', screen: Screen.HISTORY, icon: '📜' },
    ];

    return (
        <div className="text-center">
            <div className="mb-12">
                <h2 className="text-4xl font-bold">Bienvenue, Maître des Bœufs !</h2>
                <p className="text-gray-400">Prêt à traquer vos scores et dominer le classement ?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                    <button 
                        key={item.label}
                        onClick={() => setScreen(item.screen)}
                        className="bg-gray-800 hover:bg-orange-500 hover:text-gray-900 transition-all duration-300 rounded-lg p-6 text-left shadow-lg flex items-center"
                    >
                        <span className="text-4xl mr-4">{item.icon}</span>
                        <div>
                           <p className="text-xl font-semibold">{item.label}</p>
                           <p className="text-sm text-gray-400">Accéder à la section</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;