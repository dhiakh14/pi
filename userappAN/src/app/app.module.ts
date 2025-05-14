import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CodeInputModule } from 'angular-code-input';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { AddTaskComponent } from './pages/add-task/add-task.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { AffecterRoleComponent } from './pages/affecter-role/affecter-role.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { ToastrModule } from 'ngx-toastr';
import { GanttChartListComponent } from './pages/gantt-chart-list/gantt-chart-list.component';
import { AboutComponent } from './pages/about/about.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TaskChatComponent } from './pages/task-chat/task-chat.component';
import { CameraControlComponent } from './pages/camera-control/camera-control.component';
import { MatCardModule } from '@angular/material/card';
import { GoogleMapsModule } from '@angular/google-maps';
import { ProjectComponent } from './pages/project/project.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { ProjectStatsComponent } from './pages/project-stats/project-stats.component';
import { ProjectLocationComponent } from './pages/project-location/project-location.component';
import { ProjectDurationComponent } from './pages/project-duration/project-duration.component';
import { FactureDetailsComponent } from './pages/aziz1/facture-details/facture-details.component';
import { FactureFormComponent } from './pages/aziz1/facture-form/facture-form.component';
import { FactureListComponent } from './pages/aziz1/facture-list/facture-list.component';
import { FactureStatComponent } from './pages/aziz1/facture-stat/facture-stat.component';
import { ExchangeRatesComponent } from './pages/aziz1/exchange-rates/exchange-rates.component';
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierCardComponent } from './pages/supplier-card/supplier-card.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierUpdateComponent } from './pages/supplier-update/supplier-update.component';
import { SupplierRatingComponent } from './pages/supplier-rating/supplier-rating.component';
import { SupplierMapComponent } from './pages/supplier-map/supplier-map.component';
import { SuppPredictionComponent } from './pages/supp-prediction/supp-prediction.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DashboardArijComponent } from './pages/dashboardArij/dashboardArij.component';
import { ListLivrableComponent } from './pages/list-livrable/list-livrable.component';
import { LivrableService } from './servicesEmira/livrable.service';
import { AddLivrableComponent } from './pages/add-livrable/add-livrable.component';
import { LivrableDetailComponent } from './pages/livrable-detail/livrable-detail.component';
import { LivrableProgressComponent } from './livrable-progress/livrable-progress.component';
import { StatsComponent } from './pages/stats/stats.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StatsService } from './servicesEmira/stats.service';
import { LivPerProjComponent } from './pages/liv-per-proj/liv-per-proj.component';
import { LivrableAlertService } from './servicesEmira/livrable-alert.service';
import { LivrablePredictionComponent } from './pages/livrable-prediction/livrable-prediction.component';

import { AddHRComponent } from './pages/add-hr/add-hr.component';
import { ListHrComponent } from './pages/list-hr/list-hr.component';
import { HrDetailsComponent } from './pages/hr-details/hr-details.component';
import { AddMatComponent } from './pages/add-mat/add-mat.component';
import { MaterialResourceListComponent } from './pages/materialslist/materialslist.component';
import { PredictionComponent } from './prediction/prediction.component';
import { SupplierPredictionDetailsComponent } from './pages/supplier-prediction-details/supplier-prediction-details.component';
import { MatSelectModule } from '@angular/material/select';

import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { PredictionRiskComponent } from './pages/prediction-risk/prediction-risk.component';
















export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ActivateAccountComponent,
    ProfileComponent,
    DashboardArijComponent,
    
    HeaderComponent,
    FooterComponent,
    AddTaskComponent,
    TasksComponent,
   
    SidebarComponent,
    AffecterRoleComponent,
    HomeComponent,
    TaskDetailsComponent,
    GanttChartListComponent,
    AboutComponent,
    DashboardComponent,
    ResetPasswordComponent,
    TaskChatComponent,
    CameraControlComponent,
    ProjectComponent,
    AddProjectComponent,
    ProjectDetailsComponent,
    EditProjectComponent,
    ProjectStatsComponent,
    ProjectLocationComponent,
    ProjectDurationComponent,
    FactureListComponent,
    FactureDetailsComponent,
    FactureFormComponent,
    FactureStatComponent,
    ExchangeRatesComponent,
    SupplierListComponent,
    SupplierCardComponent,
    SupplierDetailComponent,
    SupplierUpdateComponent,
    SupplierAddComponent,
    SupplierRatingComponent,
    SupplierMapComponent,
    SuppPredictionComponent,
    ListLivrableComponent,
    AddLivrableComponent,
    LivrableDetailComponent,
    LivrableProgressComponent,
    StatsComponent,
    LivPerProjComponent,
    LivrablePredictionComponent,

    AddHRComponent,
    ListHrComponent,
    HrDetailsComponent,
    AddMatComponent,
    MaterialResourceListComponent,
    PredictionComponent,
    SupplierPredictionDetailsComponent,
    SuppPredictionComponent,

    ChatbotComponent,
      PredictionRiskComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgChartsModule,
    CommonModule,
    MatInputModule,
    MatNativeDateModule,
    NgApexchartsModule,
    MatSelectModule ,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CodeInputModule,
    MatDialogModule,
    NgxPaginationModule,

    QRCodeModule,
    NgbModule,
    MatCardModule ,
    MatProgressSpinnerModule,
    NgChartsModule,
    NgxPaginationModule,
    GoogleMapsModule,
    MatIconModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [LivrableService, StatsService, LivrableAlertService],
  bootstrap: [AppComponent],
})
export class AppModule { }
