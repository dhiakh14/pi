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
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierUpdateComponent } from './pages/supplier-update/supplier-update.component';


import { DashboardComponent }  from './pages/dashboard/dashboard.component';
import { SupplierMapComponent } from './pages/supplier-map/supplier-map.component'; // Import the map component





const routes: Routes = [
  {path:'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'roles', component: AffecterRoleComponent, canActivate:[authGuard] },
  { path: 'task-details/:idTask', component: TaskDetailsComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'supplier-map', component: SupplierMapComponent },


  
  
  


  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  { path: 'profile/:idUser', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'notadminusers', component: ProfileComponent, canActivate: [nonAdminGuardGuard] },
  { path: 'addtask', component: AddTaskComponent },
  { path: 'tasks/edit/:id', component: AddTaskComponent },
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'supplier/:id', component: SupplierDetailComponent },
  { path: 'supplier/update/:id', component: SupplierUpdateComponent },
  { path: 'add-supplier', component: SupplierAddComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
