import React, { useContext, useMemo } from 'react';
import { AppContext, Screen } from '../contexts/AppContext';
import { calculateGlobalStats, calculateWinRateByPlayerCount } from '../services/statsService';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-700 p-2 border border-gray-600 rounded">
                <p className="label font-bold">{`${label}`}</p>
                <p className="text-orange-400">{`${payload[0].name} : ${payload[0].value}`}</p>
                 {payload[0].payload.date && <p className="text-gray-300">{`Date : ${payload[0].payload.date}`}</p>}
            </div>
        );
    }
    return null;
};

const StatsScreen: React.FC = () => {
    const { games, players, setScreen } = useContext(AppContext);

    const { gameIntensityData, gameAttendanceData, scoreDistributionData, tightestGame, mostExplosiveGame } = useMemo(
        () => calculateGlobalStats(games), 
        [games]
    );

    const { stats: winRateStats, playerCounts } = useMemo(
        () => calculateWinRateByPlayerCount(players, games),
        [players, games]
    );

    if (games.length === 0) {
        return (
            <div className="text-center">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Statistiques des Parties</h2>
                    <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                        &larr; Retour
                    </button>
                </div>
                <p className="text-gray-400 mt-12">Pas assez de données de parties pour afficher les statistiques.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Statistiques des Parties</h2>
                <button onClick={() => setScreen(Screen.HOME)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition">
                    &larr; Retour
                </button>
            </div>

            {/* Records */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Records des Parties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-400">Partie la plus serrée 🤏</h4>
                        {tightestGame ? (
                            <p className="text-lg">
                                {new Date(tightestGame.game.date).toLocaleDateString('fr-FR')} avec un écart de <strong>{tightestGame.gap} points</strong>.
                            </p>
                        ) : <p>N/A</p>}
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-400">Partie la plus explosive 🔥</h4>
                        {mostExplosiveGame ? (
                             <p className="text-lg">
                                {new Date(mostExplosiveGame.game.date).toLocaleDateString('fr-FR')} avec <strong>{mostExplosiveGame.totalScore} points</strong> au total.
                            </p>
                        ) : <p>N/A</p>}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-4">Intensité des Parties (Score Moyen)</h3>
                    <div className="bg-gray-800 p-4 rounded-lg" style={{ height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gameIntensityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="name" stroke="#A0AEC0"/>
                                <YAxis stroke="#A0AEC0"/>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Score Moyen" stroke="#F6AD55" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-bold mb-4">Affluence des Parties</h3>
                    <div className="bg-gray-800 p-4 rounded-lg" style={{ height: '400px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gameAttendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/>
                                <XAxis dataKey="name" stroke="#A0AEC0"/>
                                <YAxis allowDecimals={false} stroke="#A0AEC0"/>
                                <Tooltip content={<CustomTooltip />}/>
                                <Legend />
                                <Bar dataKey="Joueurs" fill="#4299E1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Score Distribution */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Répartition des Scores Finaux</h3>
                <div className="bg-gray-800 p-4 rounded-lg" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/>
                            <XAxis dataKey="name" stroke="#A0AEC0"/>
                            <YAxis allowDecimals={false} stroke="#A0AEC0"/>
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend />
                            <Bar dataKey="Nombre de fois" fill="#48BB78" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Win Rate Table */}
            <div>
                 <h3 className="text-2xl font-bold mb-4">Taux de Victoire selon le Nombre de Joueurs</h3>
                 <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold">Joueur</th>
                                {playerCounts.map(count => (
                                    <th key={count} className="p-4 font-semibold text-center">{count} Joueurs</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {players.filter(p => p.isActive).map(player => (
                                <tr key={player.id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4 font-semibold">{player.pseudo}</td>
                                    {playerCounts.map(count => {
                                        const stat = winRateStats[player.id]?.[count];
                                        if (!stat || stat.games === 0) {
                                            return <td key={count} className="p-4 text-center text-gray-500">-</td>;
                                        }
                                        const winRate = (stat.wins / stat.games) * 100;
                                        return (
                                            <td key={count} className="p-4 text-center">
                                                <span className={`font-bold ${winRate > 50 ? 'text-green-400' : winRate > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {winRate.toFixed(0)}%
                                                </span>
                                                <span className="text-xs text-gray-400 block">({stat.games} p.)</span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>

        </div>
    );
};

export default StatsScreen;
