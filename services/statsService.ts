
import { Player, Game } from '../types';

export const calculateLeaderboard = (players: Player[], games: Game[]) => {
    const stats = players.map(player => {
        const playerGames = games.filter(g => g.playerIds.includes(player.id));
        if (playerGames.length === 0) {
            return null;
        }
        
        let totalPoints = 0;
        let totalRounds = 0;
        playerGames.forEach(game => {
            totalPoints += game.totals[player.id] || 0;
            totalRounds += game.rounds.length;
        });
        
        const avgScorePerRound = totalRounds > 0 ? totalPoints / totalRounds : 0;

        return {
            player,
            gamesPlayed: playerGames.length,
            avgScorePerRound,
            totalPoints,
            totalRounds,
        };
    }).filter((stat): stat is NonNullable<typeof stat> => stat !== null);

    return stats.sort((a, b) => a.avgScorePerRound - b.avgScorePerRound);
};


export const calculatePlayerProfile = (playerId: string, allPlayers: Player[], allGames: Game[]) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return null;
    
    const playerGames = allGames.filter(g => g.playerIds.includes(playerId));
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
    let totalRounds = 0;
    let wins = 0;
    let bestScore: number | null = null;
    let worstScore: number | null = null;

    playerGames.forEach(game => {
        const score = game.totals[playerId];
        totalPoints += score;
        totalRounds += game.rounds.length;
        if (game.winnerId === playerId) wins++;
        if (bestScore === null || score < bestScore) bestScore = score;
        if (worstScore === null || score > worstScore) worstScore = score;
    });

    const gamesPlayed = playerGames.length;
    const avgScorePerGame = totalPoints / gamesPlayed;
    const avgScorePerRound = totalRounds > 0 ? totalPoints / totalRounds : 0;
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
        const opponents = game.playerIds.filter(id => id !== playerId);
        opponents.forEach(oppId => {
            opponentsStats[oppId].games++;
            if (game.winnerId === playerId) opponentsStats[oppId].wins++;
            if (game.winnerId === oppId) opponentsStats[oppId].losses++;
        });

        if (game.winnerId === playerId) {
            const allies = game.playerIds.filter(id => id !== playerId && id !== game.loserId);
             allies.forEach(allyId => {
                if (alliesStats[allyId]) {
                    alliesStats[allyId].games++;
                    alliesStats[allyId].wins++;
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
        avgScorePerGame, avgScorePerRound,
        bestScore, worstScore,
        totalPoints, totalRounds,
        nemesis, luckyCharm
    };
};

export const calculateHallOfFame = (players: Player[], games: Game[]) => {
    if (players.length === 0 || games.length === 0) {
        return { king: null, collector: null, metronome: null };
    }

    let king: { player: Player, wins: number } | null = null;
    let collector: { player: Player, points: number } | null = null;
    
    const leaderboard = calculateLeaderboard(players, games);
    const metronome = leaderboard.length > 0 ? { player: leaderboard[0].player, score: leaderboard[0].avgScorePerRound } : null;

    players.forEach(player => {
        const playerGames = games.filter(g => g.playerIds.includes(player.id));
        const wins = playerGames.filter(g => g.winnerId === player.id).length;
        const totalPoints = playerGames.reduce((sum, game) => sum + (game.totals[player.id] || 0), 0);

        if (!king || wins > king.wins) {
            king = { player, wins };
        }
        if (!collector || totalPoints > collector.points) {
            collector = { player, points: totalPoints };
        }
    });

    return { king, collector, metronome };
};
