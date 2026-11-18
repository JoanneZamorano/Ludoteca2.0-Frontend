import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { Client } from '../model/client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-client-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './client-edit.component.html',
    styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent implements OnInit {
    protected readonly dialogRef = inject(MatDialogRef<ClientEditComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA) as { client: Client };
    protected readonly clientService = inject(ClientService);

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);

    ngOnInit(): void {
        this.loadFormData(this.data.client ?? null);
    }

    loadFormData(initialData: Client | null): void {
        this.id.set(initialData?.id ?? null);
        this.name.set(initialData?.name ?? null);
    }

    onSave() {
        const id = this.id();
        const name = this.name();

        if(!name) {
            return;
        }

        const client = { id, name } as Client;
        this.clientService.saveClient(client).subscribe({
            next: () => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                alert(err.error?.message ??'Error al guardar el préstamo');
            }
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}
