import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { AssistantChatComponent } from './shared/assistant-chat/assistant-chat';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FooterComponent, AssistantChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('template');
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    // Language service will initialize automatically
  }
}
