"use strict";

export default class ApiService {
    apiUrl: string;

    constructor() {
        this.apiUrl = `https://0.0.0.0:3333/game/`;
    }

    async createPlayer(payload: any): Promise<any> {
        return await fetch(`${this.apiUrl}player`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    async sendScore(payload: any): Promise<any> {
        return await fetch(`${this.apiUrl}score`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        })
    }
}