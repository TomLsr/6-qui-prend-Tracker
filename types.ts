
export interface Player {
    id: string;
    pseudo: string;
    avatar: string;
    isActive: boolean;
}

export interface GameParticipant {
    player: Player;
    score: number;
    is_winner: boolean;
    is_loser: boolean;
}

export interface Game {
    id: string;
    date: string;
    winner_id?: string;
    loser_id?: string;
}

// Type de données complet utilisé côté client
export interface GameData extends Game {
    participants: GameParticipant[];
}
