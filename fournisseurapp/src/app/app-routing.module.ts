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


const routes: Routes = [
  {path:'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'roles', component: AffecterRoleComponent, canActivate:[authGuard] },
  { path: 'task-details/:idTask', component: TaskDetailsComponent },

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
