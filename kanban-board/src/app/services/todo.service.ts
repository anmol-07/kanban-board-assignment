import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://dummyjson.com/todos';

  async getTodos() {
    const response = await axios.get(this.apiUrl);
    return response.data.todos;
  }

  async addTodo(todo: { title: string; status: string }) {
    return await axios.post(this.apiUrl + '/add', todo);
  }

  async updateTodo(id: number, updates: Object) {
    return await axios.put(`${this.apiUrl}/${id}`, updates);
  }

  async deleteTodo(id: number) {
    return await axios.delete(`${this.apiUrl}/${id}`);
  }
}
