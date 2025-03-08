import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTodoDialogComponent } from './add-update-todo-dialog.component';

describe('AddUpdateTodoDialogComponent', () => {
  let component: AddUpdateTodoDialogComponent;
  let fixture: ComponentFixture<AddUpdateTodoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateTodoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
