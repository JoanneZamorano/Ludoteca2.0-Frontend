import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../page/pageable';
import { Loan } from './model/loan';
import { PaginatedData } from '../page/paginated-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class LoanService {
    protected readonly http = inject(HttpClient);

    private baseUrl = `${environment.apiUrl}/loan`;
    


    getLoans(pageable: Pageable, idGame: number | null, idClient: number | null, date: string | null): Observable<PaginatedData<Loan>> {
        return this.http.post<PaginatedData<Loan>>(this.baseUrl, { pageable: pageable, idGame: idGame, idClient: idClient, date: date });
    }

    saveLoan(loan: Loan): Observable<Loan> {
        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan);
    }

    deleteLoan(idLoan: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
    }

    getAllLoans(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.baseUrl);
    }

}