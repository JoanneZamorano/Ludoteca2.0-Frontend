import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs/operators';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NACIONALIDADES} from '../nacionalidades';

import { AuthorService } from '../author.service';
import { Author } from '../model/author';
//import { validateFields } from '../../core/helpers/validation.helper';

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, NgxMatSelectSearchModule ],
    templateUrl: './author-edit.html',
    styleUrl: './author-edit.scss',
})
export class AuthorEdit implements OnInit {
    protected readonly authorService = inject(AuthorService);
    protected readonly dialogRef = inject(MatDialogRef<AuthorEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);
    protected readonly nationality = signal<string | null>(null);

    protected nacionalidades: string[] = NACIONALIDADES;

    public nacionalidadCtrl = new FormControl<string | null>(
        this.nacionalidades[62]
    );

    public nacionalidadFilterCtrl = new FormControl<string>('',{ nonNullable: true });

    private $nacionalidadControlChanges = toSignal(
        this.nacionalidadFilterCtrl.valueChanges.pipe(
        startWith('')
        ),
        {
            initialValue: ''
        }
    );

    public $filteredNacionalidades = computed(() => {
        const search = this.$nacionalidadControlChanges()
            .trim()
            .toLowerCase();

    if (!search) {
        return this.nacionalidades;
    }

    return this.nacionalidades.filter(nacionalidad =>
        nacionalidad.toLowerCase().includes(search)
        );
    }); 

    loadFormData(initialData: Author | null) {
        this.id.set(initialData?.id ?? null);
        this.name.set(initialData?.name ?? null);
        this.nationality.set(initialData?.nationality ?? null);
    }

    ngOnInit(): void {
        this.loadFormData(this.data.author ?? null);
    }

    onSave() {
        const id = this.id();
        const name = this.name();
        const nationality = this.nationality();

        const requiredFields = ["name", "nationality"] as const
        const data = { name, nationality }

        /*if (!validateFields(data, requiredFields)) {
            return;
        }
            */

        const author = {
            id,
            name,
            nationality,
        } as Author;
        this.authorService.saveAuthor(author).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}
