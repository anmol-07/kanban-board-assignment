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

  /**
   * 
   * @param id 
   * Function to delete TODO from the List by calling the service
   */
  async deleteTodo(id: number) {
    try {
    await this.todoService.deleteTodo(id);
    } catch(e) {
      console.log(`Some error in API`);
    } finally {  //Added Error Handling
      this.todos = this.todos.filter(todo => todo.id !== id);
    }
  }

  /**
   * 
   * @param status 
   * @returns Filtered todo list wrt to the column
   * Also updates as soon as TODO is added or updated
   */
  getFilteredTodos(status: string) {
    return this.todos.filter(todo => todo.status === status);
  }

  /**
   * 
   * @param event 
   * @param todo 
   * Function to detect Drag event
   */
  onDragStart(event: DragEvent, todo: any) {
    event.dataTransfer?.setData("text/plain", todo.id.toString());
  }

  /**  Function to prevent default behavior on drop */
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  /**
   * 
   * @param event 
   * @param newStatus 
   * @returns 
   * Function to handle drop event: Move todo to the new column
   */
  async onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();

    const todoId = event.dataTransfer?.getData("text/plain");
    if (!todoId) return;

    const todo = this.todos.find(t => t.id === parseInt(todoId));
    if (!todo) return;

    todo.status = newStatus;
    
    // Update the status of the todo on the backend 
    await this.todoService.updateTodo(todo.id, { 
      completed: newStatus === TaskStatus.Completed ? true : false
    });
  }

  /**
   * 
   * @param todoId 
   * Function to open the modal which solve dual purpose
   * i.e. it helps in both updating and adding a new TODO
   */
  openAddTodoDialog(todoId: number | undefined = undefined) {
    const todoToBeUpdated = this.todos.find(t => t.id === todoId);
    const dialogRef = this.dialog.open(AddUpdateTodoDialogComponent, {
      width: '400px',
      panelClass: 'add-todo-modal',
      data: todoToBeUpdated ? todoToBeUpdated : {}
    });

    //Check response from Material Dialog
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
