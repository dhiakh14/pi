import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
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
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { ToastrModule } from 'ngx-toastr';
import { GanttChartListComponent } from './pages/gantt-chart-list/gantt-chart-list.component';
import { AboutComponent } from './pages/about/about.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { ProjectStatsComponent } from './pages/project-stats/project-stats.component';
import { ProjectLocationComponent } from './pages/project-location/project-location.component';
import { ProjectDurationComponent } from './pages/project-duration/project-duration.component';
import { PredictionStatutComponent } from './pages/prediction-statut/prediction-statut.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    ProjectComponent,
    AddProjectComponent,
    ProjectDetailsComponent,
    EditProjectComponent,
    ProjectStatsComponent,
    ProjectLocationComponent,
    ProjectDurationComponent,
    PredictionStatutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule,
    MatDialogModule,
    QRCodeModule,
    GoogleMapsModule,
    MatProgressSpinnerModule,
    NgbModule,
    NgChartsModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],

  bootstrap: [AppComponent]
})
export class AppModule { }
