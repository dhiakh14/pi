/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Task } from '../../models/task';

export interface GetTasksByProjectId$Params {
  projectId: number;
}

export function getTasksByProjectId(http: HttpClient, rootUrl: string, params: GetTasksByProjectId$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Task>>> {
  const rb = new RequestBuilder(rootUrl, getTasksByProjectId.PATH, 'get');
  if (params) {
    rb.path('projectId', params.projectId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Task>>;
    })
  );
}

getTasksByProjectId.PATH = '/Task/getTasksByProject/{projectId}';
