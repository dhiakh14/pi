/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addProject } from '../fn/project-controller/add-project';
import { AddProject$Params } from '../fn/project-controller/add-project';
import { countProjectsByStatus } from '../fn/project-controller/count-projects-by-status';
import { CountProjectsByStatus$Params } from '../fn/project-controller/count-projects-by-status';
import { deleteProject } from '../fn/project-controller/delete-project';
import { DeleteProject$Params } from '../fn/project-controller/delete-project';
import { findProjectById } from '../fn/project-controller/find-project-by-id';
import { FindProjectById$Params } from '../fn/project-controller/find-project-by-id';
import { getAllProjects } from '../fn/project-controller/get-all-projects';
import { GetAllProjects$Params } from '../fn/project-controller/get-all-projects';
import { getAverageDuration } from '../fn/project-controller/get-average-duration';
import { GetAverageDuration$Params } from '../fn/project-controller/get-average-duration';
import { getProjectLocation } from '../fn/project-controller/get-project-location';
import { GetProjectLocation$Params } from '../fn/project-controller/get-project-location';
import { getProjectProgress } from '../fn/project-controller/get-project-progress';
import { GetProjectProgress$Params } from '../fn/project-controller/get-project-progress';
import { getRemainingDays } from '../fn/project-controller/get-remaining-days';
import { GetRemainingDays$Params } from '../fn/project-controller/get-remaining-days';
import { getStatisticsByStatus } from '../fn/project-controller/get-statistics-by-status';
import { GetStatisticsByStatus$Params } from '../fn/project-controller/get-statistics-by-status';
import { Project } from '../models/project';
import { updateProject } from '../fn/project-controller/update-project';
import { UpdateProject$Params } from '../fn/project-controller/update-project';

@Injectable({ providedIn: 'root' })
export class ProjectControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `updateProject()` */
  static readonly UpdateProjectPath = '/project/updateProject/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateProject()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProject$Response(params: UpdateProject$Params, context?: HttpContext): Observable<StrictHttpResponse<Project>> {
    return updateProject(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateProject$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateProject(params: UpdateProject$Params, context?: HttpContext): Observable<Project> {
    return this.updateProject$Response(params, context).pipe(
      map((r: StrictHttpResponse<Project>): Project => r.body)
    );
  }

  /** Path part for operation `addProject()` */
  static readonly AddProjectPath = '/project/addProject';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addProject()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addProject$Response(params: AddProject$Params, context?: HttpContext): Observable<StrictHttpResponse<Project>> {
    return addProject(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addProject$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addProject(params: AddProject$Params, context?: HttpContext): Observable<Project> {
    return this.addProject$Response(params, context).pipe(
      map((r: StrictHttpResponse<Project>): Project => r.body)
    );
  }

  /** Path part for operation `getStatisticsByStatus()` */
  static readonly GetStatisticsByStatusPath = '/project/statisticsByStatus';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatisticsByStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStatisticsByStatus$Response(params?: GetStatisticsByStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<{
[key: string]: number;
}>> {
    return getStatisticsByStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatisticsByStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStatisticsByStatus(params?: GetStatisticsByStatus$Params, context?: HttpContext): Observable<{
[key: string]: number;
}> {
    return this.getStatisticsByStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: number;
}>): {
[key: string]: number;
} => r.body)
    );
  }

  /** Path part for operation `getRemainingDays()` */
  static readonly GetRemainingDaysPath = '/project/remainingDays/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRemainingDays()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRemainingDays$Response(params: GetRemainingDays$Params, context?: HttpContext): Observable<StrictHttpResponse<{
[key: string]: {
};
}>> {
    return getRemainingDays(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getRemainingDays$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRemainingDays(params: GetRemainingDays$Params, context?: HttpContext): Observable<{
[key: string]: {
};
}> {
    return this.getRemainingDays$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
[key: string]: {
};
}>): {
[key: string]: {
};
} => r.body)
    );
  }

  /** Path part for operation `getProjectProgress()` */
  static readonly GetProjectProgressPath = '/project/progress/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProjectProgress()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectProgress$Response(params: GetProjectProgress$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return getProjectProgress(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProjectProgress$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectProgress(params: GetProjectProgress$Params, context?: HttpContext): Observable<{
}> {
    return this.getProjectProgress$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `getProjectLocation()` */
  static readonly GetProjectLocationPath = '/project/location/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProjectLocation()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectLocation$Response(params: GetProjectLocation$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return getProjectLocation(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProjectLocation$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProjectLocation(params: GetProjectLocation$Params, context?: HttpContext): Observable<string> {
    return this.getProjectLocation$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `countProjectsByStatus()` */
  static readonly CountProjectsByStatusPath = '/project/getProjectsByStatus/{status}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `countProjectsByStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  countProjectsByStatus$Response(params: CountProjectsByStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return countProjectsByStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `countProjectsByStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  countProjectsByStatus(params: CountProjectsByStatus$Params, context?: HttpContext): Observable<number> {
    return this.countProjectsByStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `findProjectById()` */
  static readonly FindProjectByIdPath = '/project/getProjectById/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findProjectById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findProjectById$Response(params: FindProjectById$Params, context?: HttpContext): Observable<StrictHttpResponse<Project>> {
    return findProjectById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findProjectById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findProjectById(params: FindProjectById$Params, context?: HttpContext): Observable<Project> {
    return this.findProjectById$Response(params, context).pipe(
      map((r: StrictHttpResponse<Project>): Project => r.body)
    );
  }

  /** Path part for operation `getAllProjects()` */
  static readonly GetAllProjectsPath = '/project/getAllProjects';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllProjects()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllProjects$Response(params?: GetAllProjects$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Project>>> {
    return getAllProjects(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllProjects$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllProjects(params?: GetAllProjects$Params, context?: HttpContext): Observable<Array<Project>> {
    return this.getAllProjects$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Project>>): Array<Project> => r.body)
    );
  }

  /** Path part for operation `getAverageDuration()` */
  static readonly GetAverageDurationPath = '/project/averageDuration';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAverageDuration()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAverageDuration$Response(params?: GetAverageDuration$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return getAverageDuration(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAverageDuration$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAverageDuration(params?: GetAverageDuration$Params, context?: HttpContext): Observable<number> {
    return this.getAverageDuration$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `deleteProject()` */
  static readonly DeleteProjectPath = '/project/deleteProject/{idProject}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProject()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProject$Response(params: DeleteProject$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteProject(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteProject$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteProject(params: DeleteProject$Params, context?: HttpContext): Observable<void> {
    return this.deleteProject$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
