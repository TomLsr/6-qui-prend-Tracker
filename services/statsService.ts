import { Player, GameData } from '../types';

// NOTE: This implementation assumes a simplified game model where `rounds` are not tracked individually.
// The average score per round is effectively the average score per game.

export const calculateLeaderboard = (players: Player[], games: GameData[]) => {
    const stats = players.map(player => {
        const playerGames = games.filter(g => g.participants.some(p => p.player.id === player.id));
        if (playerGames.length === 0) {
            return null;
        }
        
        let totalPoints = 0;
        playerGames.forEach(game => {
            const participant = game.participants.find(p => p.player.id === player.id);
            totalPoints += participant?.score || 0;
        });
        
        const avgScorePerGame = totalPoints / playerGames.length;

        return {
            player,
            gamesPlayed: playerGames.length,
            avgScorePerRound: avgScorePerGame, // Using per game as rounds are not stored
            totalPoints,
            totalRounds: playerGames.length, // Placeholder
        };
    }).filter((stat): stat is NonNullable<typeof stat> => stat !== null);

    return stats.sort((a, b) => a.avgScorePerRound - b.avgScorePerRound);
};


export const calculatePlayerProfile = (playerId: string, allPlayers: Player[], allGames: GameData[]) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return null;
    
    const playerGames = allGames.filter(g => g.participants.some(p => p.player.id === playerId));
    if (playerGames.length === 0) {
        return {
            player,
            gamesPlayed: 0, wins: 0, winRate: 0,
            avgScorePerGame: 0, avgScorePerRound: 0,
            bestScore: null, worstScore: null,
            totalPoints: 0, totalRounds: 0,
            nemesis: null, luckyCharm: null,
        };
    }

    let totalPoints = 0;
    let wins = 0;
    let bestScore: number | null = null;
    let worstScore: number | null = null;

    playerGames.forEach(game => {
        const participant = game.participants.find(p => p.player.id === playerId)!;
        const score = participant.score;
        totalPoints += score;
        if (game.winner_id === playerId) wins++;
        if (bestScore === null || score < bestScore) bestScore = score;
        if (worstScore === null || score > worstScore) worstScore = score;
    });

    const gamesPlayed = playerGames.length;
    const avgScorePerGame = totalPoints / gamesPlayed;
    const winRate = (wins / gamesPlayed) * 100;

    // Nemesis & Lucky Charm
    const opponentsStats: { [opponentId: string]: { wins: number; losses: number; games: number } } = {};
    const alliesStats: { [allyId: string]: { wins: number; games: number } } = {};
    
    allPlayers.forEach(p => {
        if(p.id !== playerId) {
            opponentsStats[p.id] = { wins: 0, losses: 0, games: 0 };
            alliesStats[p.id] = { wins: 0, games: 0 };
        }
    });

    playerGames.forEach(game => {
        const opponents = game.participants.filter(p => p.player.id !== playerId);
        opponents.forEach(opp => {
            opponentsStats[opp.player.id].games++;
            if (game.winner_id === playerId) opponentsStats[opp.player.id].wins++;
            if (game.winner_id === opp.player.id) opponentsStats[opp.player.id].losses++;
        });

        if (game.winner_id === playerId) {
            const allies = game.participants.filter(p => p.player.id !== playerId && p.player.id !== game.loser_id);
             allies.forEach(ally => {
                if (alliesStats[ally.player.id]) {
                    alliesStats[ally.player.id].games++;
                    alliesStats[ally.player.id].wins++;
                }
            });
        }
    });
    
    let nemesis: Player | null = null;
    let maxLossRate = -1;
    Object.entries(opponentsStats).forEach(([oppId, stats]) => {
        if(stats.games > 2) {
            const lossRate = stats.losses / stats.games;
            if (lossRate > maxLossRate) {
                maxLossRate = lossRate;
                nemesis = allPlayers.find(p => p.id === oppId) || null;
            }
        }
    });

    let luckyCharm: Player | null = null;
    let maxWinRateWith = -1;
    Object.entries(alliesStats).forEach(([allyId, stats]) => {
        if (stats.games > 2) {
            const winRateWith = stats.wins / stats.games;
            if(winRateWith > maxWinRateWith) {
                maxWinRateWith = winRateWith;
                luckyCharm = allPlayers.find(p => p.id === allyId) || null;
            }
        }
    });

    return {
        player,
        gamesPlayed, wins, winRate,
        avgScorePerGame, avgScorePerRound: avgScorePerGame, // Using per game
        bestScore, worstScore,
        totalPoints, totalRounds: gamesPlayed, // Placeholder
        nemesis, luckyCharm
    };
};

export const calculateHallOfFame = (players: Player[], games: GameData[]) => {
    if (players.length === 0 || games.length === 0) {
        return { king: null, collector: null, metronome: null };
    }

    let king: { player: Player, wins: number } | null = null;
    let collector: { player: Player, points: number } | null = null;
    
    const leaderboard = calculateLeaderboard(players, games);
    const metronome = leaderboard.length > 0 ? { player: leaderboard[0].player, score: leaderboard[0].avgScorePerRound } : null;

    players.forEach(player => {
        const playerGames = games.filter(g => g.participants.some(p => p.player.id === player.id));
        const wins = playerGames.filter(g => g.winner_id === player.id).length;
        const totalPoints = playerGames.reduce((sum, game) => {
            const participant = game.participants.find(p => p.player.id === player.id);
            return sum + (participant?.score || 0);
        }, 0);

        if (!king || wins > king.wins) {
            king = { player, wins };
        }
        if (!collector || totalPoints > collector.points) {
            collector = { player, points: totalPoints };
        }
    });

    return { king, collector, metronome };
};
