import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskChatComponent } from './task-chat.component';

describe('TaskChatComponent', () => {
  let component: TaskChatComponent;
  let fixture: ComponentFixture<TaskChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskChatComponent]
    });
    fixture = TestBed.createComponent(TaskChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
