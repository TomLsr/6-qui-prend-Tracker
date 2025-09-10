import React, { useContext } from 'react';
import { AppContext, Screen } from './contexts/AppContext';
import PlayersScreen from './screens/PlayersScreen';
import HomeScreen from './screens/HomeScreen';
import NewGameScreen from './screens/NewGameScreen';
import GameScreen from './screens/GameScreen';
import GameSummaryScreen from './screens/GameSummaryScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import PlayerProfileScreen from './screens/PlayerProfileScreen';
import HallOfFameScreen from './screens/HallOfFameScreen';
import HistoryScreen from './screens/HistoryScreen';
import StatsScreen from './screens/StatsScreen';
import { GameData } from './types';

const App: React.FC = () => {
    const { 
        screen, setScreen, 
        activeGame, setActiveGame, 
        selectedPlayerId,
        selectedGame,
        loading,
    } = useContext(AppContext);

    const renderScreen = () => {
        switch (screen) {
            case Screen.HOME:
                return <HomeScreen />;
            case Screen.PLAYERS:
                return <PlayersScreen />;
            case Screen.NEW_GAME:
                return <NewGameScreen />;
            case Screen.GAME:
                if (activeGame) {
                    return <GameScreen game={activeGame} setGame={setActiveGame as React.Dispatch<React.SetStateAction<GameData | null>>} />;
                }
                setScreen(Screen.NEW_GAME);
                return null;
            case Screen.GAME_SUMMARY:
                if (selectedGame) {
                    return <GameSummaryScreen game={selectedGame} />;
                }
                setScreen(Screen.HOME);
                return null;
            case Screen.LEADERBOARD:
                return <LeaderboardScreen />;
            case Screen.PLAYER_PROFILE:
                if(selectedPlayerId) {
                    return <PlayerProfileScreen playerId={selectedPlayerId} />;
                }
                setScreen(Screen.PLAYERS);
                return null;
            case Screen.HALL_OF_FAME:
                return <HallOfFameScreen />;
            case Screen.HISTORY:
                return <HistoryScreen />;
            case Screen.STATS:
                return <StatsScreen />;
            default:
                return <HomeScreen />;
        }
    };

    const renderBottomNav = () => {
        if (!activeGame || screen === Screen.GAME_SUMMARY) {
            return null;
        }

        const navItems = [
            { label: 'Partie', screen: Screen.GAME, icon: '🎮' },
            { label: 'Classement', screen: Screen.LEADERBOARD, icon: '🏆' },
            { label: 'Palmarès', screen: Screen.HALL_OF_FAME, icon: '🏅' },
            { label: 'Historique', screen: Screen.HISTORY, icon: '📜' },
        ];

        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
                <div className="max-w-7xl mx-auto flex justify-around">
                    {navItems.map(item => (
                        <button
                            key={item.label}
                            onClick={() => setScreen(item.screen)}
                            className={`flex flex-col items-center justify-center py-2 px-1 text-xs w-full transition-colors duration-200 ${
                                screen === item.screen
                                ? 'text-orange-500'
                                : 'text-gray-400 hover:text-orange-500'
                            }`}
                        >
                            <span className="text-2xl mb-1">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        );
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
            <div className={`max-w-7xl mx-auto ${activeGame && screen !== Screen.GAME_SUMMARY ? 'pb-20' : ''}`}>
                <header className="flex justify-between items-center mb-6">
                    <h1 
                        className={`text-3xl font-bold text-orange-500 ${!activeGame ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => {
                            if (!activeGame) {
                                setScreen(Screen.HOME);
                            }
                        }}
                    >
                        6 qui prend ! Tracker
                    </h1>
                </header>
                <main>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        renderScreen()
                    )}
                </main>
                <footer className="text-center mt-12 text-gray-500">
                    <p>&copy; 2024 - Built for fun</p>
                </footer>
            </div>
            {renderBottomNav()}
        </div>
    );
};

export default App;