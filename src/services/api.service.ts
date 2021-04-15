"use strict";

export default class ApiService {
    apiUrl: string;

    constructor() {
        this.apiUrl = `https://0.0.0.0:3333/game/`;
    }

    /**
     * Create a player profile at the beginning of the game
     * 
     * @param payload 
     * @returns 
     */
    async createPlayer(payload: any): Promise<any> {
        return await fetch(`${this.apiUrl}player`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    /**
     * Store score in database and link it to a player and lead
     * 
     * @param payload 
     * @returns 
     */
    async sendScore(payload: any): Promise<any> {
        return await fetch(`${this.apiUrl}score`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        });
    } 

    /**
     * Get player's ranking
     * 
     * @param player_id Number 
     */
    async getRanking(lead: any, player_token: string): Promise<any> {
        return await fetch(`${this.apiUrl}score/ranking`, {
            method: 'POST',
            body: JSON.stringify({
                lead: lead,
                player: player_token
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}