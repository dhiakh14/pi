import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { SupplierAddComponent } from './pages/supplier-add/supplier-add.component';
import { SupplierCardComponent } from './pages/supplier-card/supplier-card.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierUpdateComponent } from './pages/supplier-update/supplier-update.component';
import { NgChartsModule } from 'ng2-charts';
import { GoogleMapsModule } from '@angular/google-maps';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { SupplierRatingComponent } from './pages/supplier-rating/supplier-rating.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SupplierMapComponent } from './pages/supplier-map/supplier-map.component';
import { SuppPredictionComponent } from './pages/supp-prediction/supp-prediction.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core'; // <-- Keep this import

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
    SupplierListComponent,
    SupplierCardComponent,
    SupplierDetailComponent,
    SupplierUpdateComponent,
    SupplierAddComponent,
    SupplierRatingComponent,
    DashboardComponent,
    SupplierMapComponent,
    SuppPredictionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule,
    NgChartsModule,
    GoogleMapsModule,
    MatNativeDateModule, // <-- Keep this for datepicker

    // Angular Material Modules
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
