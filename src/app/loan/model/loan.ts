import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/client";

export interface Loan {
    id: number;
    game: Game;
    client: Client;
    startDate: string;
    endDate: string;
}