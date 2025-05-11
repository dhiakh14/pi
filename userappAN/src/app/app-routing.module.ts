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
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { connectedGuard } from './guards/connected.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TaskChatComponent } from './pages/task-chat/task-chat.component';
import { CameraControlComponent } from './pages/camera-control/camera-control.component';
import { ProjectComponent } from './pages/project/project.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component'
import { ProjectStatsComponent } from './pages/project-stats/project-stats.component'
import { ProjectLocationComponent } from './pages/project-location/project-location.component';
import { ProjectDurationComponent } from './pages/project-duration/project-duration.component';
import { PredictionStatutComponent } from './pages/prediction-statut/prediction-statut.component';
import { FactureListComponent } from './pages/aziz1/facture-list/facture-list.component';
import { FactureFormComponent } from './pages/aziz1/facture-form/facture-form.component';
import { FactureDetailsComponent } from './pages/aziz1/facture-details/facture-details.component';
import { FactureStatComponent } from './pages/aziz1/facture-stat/facture-stat.component';
import { ExchangeRatesComponent } from './pages/aziz1/exchange-rates/exchange-rates.component';
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierUpdateComponent } from './pages/supplier-update/supplier-update.component';


import { SupplierMapComponent } from './pages/supplier-map/supplier-map.component'; // Import the map component
import { SuppPredictionComponent } from './pages/supp-prediction/supp-prediction.component';
import { DashboardArijComponent } from './pages/dashboardArij/dashboardArij.component';
import { ListLivrableComponent } from './pages/list-livrable/list-livrable.component';
import { AddLivrableComponent } from './pages/add-livrable/add-livrable.component';
import { LivrableDetailComponent } from './pages/livrable-detail/livrable-detail.component';
import { StatsComponent } from './pages/stats/stats.component';
import { LivPerProjComponent } from './pages/liv-per-proj/liv-per-proj.component';
import { LivrableChartComponent } from './pages/livrable-chart/livrable-chart.component';
import { LivrablePredictionComponent } from './pages/livrable-prediction/livrable-prediction.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks/:projectId', component: TasksComponent , canActivate:[connectedGuard]},
  { path: 'roles', component: AffecterRoleComponent, canActivate:[authGuard] },
  { path: 'task-details/:idTask', component: TaskDetailsComponent , canActivate:[connectedGuard]},
  {path: 'gantt' , component:GanttChartListComponent, canActivate:[connectedGuard]},
  {path: 'about', component:AboutComponent},
  {path: 'dash', component: DashboardComponent, canActivate:[connectedGuard]},
  {path:'reset-password', component: ResetPasswordComponent},
  {path:'chat', component: TaskChatComponent},

  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  { path: 'profile/:idUser', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'notadminusers', component: ProfileComponent, canActivate: [nonAdminGuardGuard] },
  { path: 'add-task', component: AddTaskComponent, canActivate:[connectedGuard] },
  { path: 'tasks/edit/:id', component: AddTaskComponent, canActivate:[connectedGuard] },
  {path:'camera', component:CameraControlComponent},
  { path: 'project', component:ProjectComponent},
  { path: 'addproject', component:AddProjectComponent},
  { path: 'editproject/:id', component:EditProjectComponent},
  { path: 'project-details/:id', component: ProjectDetailsComponent },
  { path: 'stats', component: ProjectStatsComponent },
  { path: 'map', component: ProjectLocationComponent },
  { path: 'duration', component: ProjectDurationComponent },
  { path: 'predict', component: PredictionStatutComponent },
  {path: 'facture', component: FactureListComponent},
  {path: 'addfacture', component: FactureFormComponent},
  { path: 'facture-details/:idF', component: FactureDetailsComponent },
  {path: 'stataziz', component:FactureStatComponent},
  {path: 'rate', component: ExchangeRatesComponent},
  { path: 'suppliers', component: SupplierListComponent },
  { path: 'supplier/:id', component: SupplierDetailComponent },
  { path: 'supplier/update/:id', component: SupplierUpdateComponent },
  { path: 'add-supplier', component: SupplierAddComponent },
  { path: 'supplier-map', component: SupplierMapComponent },
  { path: 'prediction', component: SuppPredictionComponent },
  {path : 'dashboard', component:DashboardArijComponent},
  { path: 'livrables', component: ListLivrableComponent },
  { path: 'add-livrable', component: AddLivrableComponent },
  {path:"details/:id",component:LivrableDetailComponent},
  { path: 'stats', component: StatsComponent },
  { path: 'liv-per-proj', component: LivPerProjComponent }, // Add this line to include the chart component
  { path: 'livrable-prediction', component: LivrablePredictionComponent }, // Add this line to include the chart component

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
