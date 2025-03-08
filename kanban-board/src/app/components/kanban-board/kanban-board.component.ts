import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { SharedModule } from '../../shared/shared.module';  // ✅ Import SharedModule
import { TaskStatus } from '../../models/todo-status.enum';
import { AddUpdateTodoDialogComponent } from '../add-update-todo-dialog/add-update-todo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements OnInit {
  todos: any[] = [];
  columns = ['Pending', 'In Progress', 'Completed'];
  userId: number = 0;

  constructor(private todoService: TodoService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.todos = await this.todoService.getTodos();
    this.todos = this.todos.map((x: any) => {
      return {
        ...x, 
        status: x.completed ? "Completed" : "Pending"
      };
    });
    this.userId = this.todos[0].userId;
    console.log(`todos are: `, this.todos);
  }

  async addTodo(title: string) {
    const newTodo = await this.todoService.addTodo({ title, status: 'Pending' });
    this.todos.push(newTodo.data);
  }

  async updateTodoStatus(todo: any, newStatus: string) {
    await this.todoService.updateTodo(todo.id, { status: newStatus });
    todo.status = newStatus;
  }

  async deleteTodo(id: number) {
    await this.todoService.deleteTodo(id);
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  getFilteredTodos(status: string) {
    return this.todos.filter(todo => todo.status === status);
  }

  onDragStart(event: DragEvent, todo: any) {
    event.dataTransfer?.setData("text/plain", todo.id.toString());
  }

  /** ✅ Allow drop by preventing default behavior */
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  /** ✅ Handle drop event: Move todo to the new column */
  async onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();

    const todoId = event.dataTransfer?.getData("text/plain");
    if (!todoId) return;

    const todo = this.todos.find(t => t.id === parseInt(todoId));
    if (!todo) return;

    todo.status = newStatus;
    
    // Optionally update on the backend
    await this.todoService.updateTodo(todo.id, { 
      completed: newStatus === TaskStatus.Completed ? true : false
    });
  }

  /** ✅ Open Dialog to Add a New Todo */
  openAddTodoDialog(todoId: number | undefined = undefined) {
    const todoToBeUpdated = this.todos.find(t => t.id === todoId);
    const dialogRef = this.dialog.open(AddUpdateTodoDialogComponent, {
      width: '400px',
      panelClass: 'add-todo-modal',
      data: todoToBeUpdated ? todoToBeUpdated : {}
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if(result.status === TaskStatus.Completed) result.completed = true;
        else result.completed = false;
        result.todo = result.title;
        delete result.title;
        if(!todoToBeUpdated){
          const newTodo = await this.todoService.addTodo({...result, userId: parseInt((Math.random()*200).toFixed())});
          this.todos = [...this.todos, {...newTodo?.data, status: result.status}];
        } else {
          todoToBeUpdated.status = result.status;
          todoToBeUpdated.completed = result.completed;
          todoToBeUpdated.todo = result.todo;
          await this.todoService.updateTodo(todoToBeUpdated.id, { 
            completed: todoToBeUpdated.completed,
            todo: todoToBeUpdated.todo
          });
        }
      }
    });
  }
  
}
