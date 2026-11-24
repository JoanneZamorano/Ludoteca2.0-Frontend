import { Service } from '@angular/core';
import { Injectable, inject } from  '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { Pageable } from '../page/pageable';
import { Author } from './model/author';
import { PaginatedData } from '../page/paginated-data';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthorService {
    protected readonly http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/author`;

    getAuthors(pageable: Pageable): Observable<PaginatedData<Author>> {
        return this.http.post<PaginatedData<Author>>(this.baseUrl, { pageable: pageable });
    }

    saveAuthor(author: Author): Observable<Author> {
        const {id} = author;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Author>(url, author);
    }

    deleteAuthor(idAuthor: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idAuthor}`);
    }

    getAllAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(this.baseUrl);
    }
}
