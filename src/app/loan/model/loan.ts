import { Game } from "../../game/model/Game";
import { Client } from "../../client/model/client";

export interface Loan {
    id: number;
    product: Game;
    client: Client;
    startDate: string;
    endDate: string;
}