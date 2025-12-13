import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { AssistantChatComponent } from './shared/assistant-chat/assistant-chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, FooterComponent, AssistantChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('template');
}
