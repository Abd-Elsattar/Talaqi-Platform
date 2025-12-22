// AssistantService: Connects the UI assistant chat to the backend.
// Sends user questions, receives AI-generated answers and related snippets,
// and maps responses into the `ChatMessage` model used by the chat component.

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, mergeMap, throwError } from 'rxjs';
import { AssistantAskRequest, AssistantAskResponse } from '../models/assistant';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private http = inject(HttpClient);
  private baseUrl = (environment.apiUrl || '').replace(/\/+$/, '');

  ask(req: AssistantAskRequest): Observable<AssistantAskResponse> {
    const url = `${this.baseUrl}/assistant/ask`;
    // Prefer JSON; if the server only accepts text/plain, retry gracefully and parse.
    const jsonHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AssistantAskResponse>(url, req, { headers: jsonHeaders }).pipe(
      map((res) => res),
      catchError((err) => {
        // Some servers require Accept: text/plain and may not declare UTF-8 properly.
        const textHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'text/plain'
        });
        return this.http.post(url, req, { headers: textHeaders, responseType: 'blob' }).pipe(
          mergeMap(async (blob) => {
            const buffer = await blob.arrayBuffer();
            const decoded = new TextDecoder('utf-8').decode(new Uint8Array(buffer));
            try {
              const parsed = JSON.parse(decoded);
              return parsed as AssistantAskResponse;
            } catch {
              // If the server returns plain text answer, wrap it into our response shape.
              const wrapped: AssistantAskResponse = {
                isSuccess: true,
                data: { answer: decoded, snippets: [] },
                message: '',
                statusCode: 200,
                errors: []
              };
              return wrapped;
            }
          })
        );
      })
    );
  }

  private static wrapErrorResponse(error: any): AssistantAskResponse {
    const msg = typeof error === 'string' ? error : 'حدث خطأ داخلي في الخادم.';
    return { isSuccess: false, data: { answer: '', snippets: [] }, message: msg, statusCode: 500, errors: [msg] };
  }
}
