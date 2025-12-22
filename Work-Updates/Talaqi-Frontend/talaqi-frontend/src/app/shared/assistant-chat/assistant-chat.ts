import { CommonModule } from '@angular/common';
import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssistantService } from '../../core/services/assistant.service';
import { ChatMessage } from '../../core/models/assistant';

@Component({
  selector: 'app-assistant-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './assistant-chat.html',
  styleUrls: ['./assistant-chat.css'],
})
export class AssistantChatComponent {
  private assistant = inject(AssistantService);
  private translate = inject(TranslateService);

  isOpen = signal(false);
  isSending = signal(false);
  inputValue = '';
  // Hint bubble visibility control
  showHint = signal(true);
  messages = signal<ChatMessage[]>([]);

  scrollEl = viewChild<ElementRef<HTMLDivElement>>('scrollArea');

  constructor() {
    effect(() => {
      // Auto-scroll when messages change
      const area = this.scrollEl()?.nativeElement;
      if (area) {
        queueMicrotask(() => (area.scrollTop = area.scrollHeight));
      }
    });
  }

  toggleOpen() {
    this.isOpen.update((v) => !v);
    // Hide hint once user opens the chat
    if (this.isOpen()) this.showHint.set(false);
  }

  close() {
    this.isOpen.set(false);
  }

  send() {
    const text = (this.inputValue || '').trim();
    if (!text || this.isSending()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      createdAt: Date.now(),
    };
    this.messages.update((list) => [...list, userMsg]);
    this.inputValue = '';
    this.isSending.set(true);

    // Optimistic typing indicator
    const typingId = crypto.randomUUID();
    const typingMsg: ChatMessage = {
      id: typingId,
      role: 'assistant',
      text: '...',
      createdAt: Date.now(),
    };
    this.messages.update((list) => [...list, typingMsg]);

    this.assistant.ask({ question: text }).subscribe({
      next: (res) => {
        // Replace typing with real answer
        this.messages.update((list) => list.filter((m) => m.id !== typingId));
        const reply: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: res?.data?.answer || '—',
          snippets: res?.data?.snippets || [],
          createdAt: Date.now(),
        };
        this.messages.update((list) => [...list, reply]);
      },
      error: () => {
        this.messages.update((list) => list.filter((m) => m.id !== typingId));
        const err: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: this.translate.instant('assistant.messages.error'),
          error: true,
          createdAt: Date.now(),
        };
        this.messages.update((list) => [...list, err]);
      },
      complete: () => {
        this.isSending.set(false);
      },
    });
  }
}
