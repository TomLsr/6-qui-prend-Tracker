
export interface Player {
    id: string;
    pseudo: string;
    avatar: string;
    isActive: boolean;
}

export interface Round {
    [playerId: string]: number;
}

export interface Game {
    id: string;
    date: string;
    playerIds: string[];
    rounds: Round[];
    totals: { [playerId: string]: number };
    winnerId?: string;
    loserId?: string;
}
