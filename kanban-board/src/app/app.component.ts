import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { CommonModule } from '@angular/common';  // ✅ Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KanbanBoardComponent, CommonModule],
  template: '<app-kanban-board></app-kanban-board>',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kanban-board';
}
