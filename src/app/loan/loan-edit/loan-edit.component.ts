import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';
import { GameService } from '../../game/game';
import { Game } from '../../game/model/Game';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { validateFields } from '../../core/helpers/validation.helper';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule ],
    templateUrl: './loan-edit.component.html',
    styleUrl: './loan-edit.component.scss',
})
export class LoanEditComponent implements OnInit {
    protected readonly loanService = inject(LoanService);
    protected readonly dialogRef = inject(MatDialogRef<LoanEditComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA)  as { loan?: Loan }
    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);

    protected readonly id = signal<number | null>(null);
    protected readonly gameId = signal<number | null>(null);
    protected readonly clientId = signal<number | null>(null);
    protected readonly startDate = signal<Date | null>(null);
    protected readonly endDate = signal<Date | null>(null);
    protected readonly games = signal<Game[]>([]);
    protected readonly clients = signal<Client[]>([]);
    protected readonly errorMessage = signal<string | null>(null);

    protected readonly weekdayFilter = (date: Date | null): boolean => {
        if (!date) {
            return false;
        }
        const day = date.getDay();  //0=domingo, 6=sábado
        return day !== 0 && day !== 6;
    };

    protected maxEndDate = signal<Date | null>(null);


    protected onStartDateChange(date: Date | null): void {

         this.startDate.set(date);

         if (!date) {
             this.maxEndDate.set(null);
             return;
        }

         const max = new Date(date);
         max.setDate(max.getDate() + 14);

         this.maxEndDate.set(max);

         if (this.endDate() && this.endDate()! > max) {
            this.endDate.set(null);
        }
    };

    ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);
    }

    loadFormData(initialData: Loan | null) {
        this.id.set(initialData?.id ?? null);

        this.gameService.getGames().subscribe((gams) => {
            this.games.set(gams);
            this.gameId.set(initialData?.game?.id ?? null);
        });

        this.clientService.getClients().subscribe((clis) => {
            this.clients.set(clis);
            this.clientId.set(initialData?.client?.id ?? null);
        });

        this.startDate.set(this.toDate(initialData?.startDate));
        this.endDate.set(this.toDate(initialData?.endDate));
    }

    onSave() {
        const id = this.id();
        const gameId = this.gameId();
        const clientId = this.clientId();
        const startDate = this.toText(this.startDate());
        const endDate = this.toText(this.endDate());

        const requiredFields = ["gameId", "clientId", "startDate", "endDate"] as const
        const data = { gameId, clientId, startDate, endDate }

        if (!validateFields(data, requiredFields)) {
            return;
        }

        const loan = {
            id,
            game: this.games().find(g => g.id === gameId) ?? null,
            client: this.clients().find(c => c.id === clientId) ?? null,
            startDate,
            endDate,
        } as Loan;

        this.errorMessage.set('');

        this.loanService.saveLoan(loan).subscribe({
            next:() => {
            this.dialogRef.close(true);
            },

        error: (err) => {

        const message =
                  err.error?.message ||
                  err.error?.detail ||
                  err.message;

            console.log(message);

            if(message?.includes('Fecha de devolución')) {
                this.errorMessage.set('La fecha de devolución no puede ser anterior a la fecha de préstamo');
        } else if (message?.includes('14 días')) {
                this.errorMessage.set('El préstamo no puede superar los 14 días');
        } else if (message?.includes('Juego no disponible')) {
                this.errorMessage.set('El juego ya está prestado en las fechas seleccionadas');
        } else if (message?.includes('2 préstamos')) {
                this.errorMessage.set('El cliente ya tiene 2 préstamos en las fechas seleccionadas');
         } else if (message?.includes('fin de semana')) {
                this.errorMessage.set('Las fechas de préstamo y devolución no pueden ser sábado ni domingo');
        } else {
            this.errorMessage.set('Se ha producido un error al guardar el préstamo');
        }
        },

      });

    }

    //MÉTODO DE CONVERSIÓN
    private toDate (text: string | null | undefined): Date | null {
        if (!text) {
            return null;
        }
        const parts = text.split('-');
        return new Date (Number(parts[0]), Number(parts[1]) -1, Number(parts[2]));
    }

    private toText (date: Date | null): string | null {
        if (!date) {
            return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    //MÉTODO DE CONVERSIÓN
    
    onClose() {
        this.dialogRef.close(false);
    }
}