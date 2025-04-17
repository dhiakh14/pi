import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { nonAdminGuardGuard } from './guards/non-admin-guard.guard';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { AffecterRoleComponent } from './pages/affecter-role/affecter-role.component';
import { HomeComponent } from './pages/home/home.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { GanttChartListComponent } from './pages/gantt-chart-list/gantt-chart-list.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectComponent } from './pages/project/project.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component'
import { ProjectStatsComponent } from './pages/project-stats/project-stats.component'
import { ProjectLocationComponent } from './pages/project-location/project-location.component';
import { ProjectDurationComponent } from './pages/project-duration/project-duration.component';
import { PredictionStatutComponent } from './pages/prediction-statut/prediction-statut.component';

const routes: Routes = [
  { path:'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'roles', component: AffecterRoleComponent, canActivate:[authGuard] },
  { path: 'task-details/:idTask', component: TaskDetailsComponent },
  { path: 'gantt' , component:GanttChartListComponent},
  { path: 'about', component:AboutComponent},
  { path: 'project', component:ProjectComponent},
  { path: 'addproject', component:AddProjectComponent},
  { path: 'editproject/:id', component:EditProjectComponent},
  { path: 'project-details/:id', component:ProjectDetailsComponent},
  { path: 'stats', component: ProjectStatsComponent },
  { path: 'map', component: ProjectLocationComponent },
  { path: 'duration', component: ProjectDurationComponent },
  { path: 'predict', component: PredictionStatutComponent },

  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  { path: 'profile/:idUser', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'notadminusers', component: ProfileComponent, canActivate: [nonAdminGuardGuard] },
  { path: 'addtask', component: AddTaskComponent },
  { path: 'tasks/edit/:id', component: AddTaskComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
