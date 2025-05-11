import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models';
import { Task } from 'src/app/services1/models';








@Injectable({
  providedIn: 'root'
})
export class serviceFeignAD {
  private baseUrl = 'http://localhost:8092/project/project';

  constructor(private http: HttpClient) { }


  getProjectWithTasks(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${projectId}/with-tasks`);
  }

  addTasksToProject(projectId: number, tasks: Task[]): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/${projectId}/add-tasks`, tasks);
  }

}