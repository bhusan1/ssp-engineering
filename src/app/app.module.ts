import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { IndexComponent } from './components/index/index.component';
import { ParallexComponent } from './components/parallex/parallex.component';
import { ServicesComponent } from './components/our-services/services.component';
import { AboutComponent } from './components/about/about.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { HighlightsComponent } from './components/highlights/highlights.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ContactComponent } from './components/contact/contact.component';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { LoginComponent } from './components/admin/login/login.component';
import { FormValidatorComponent } from './components/admin/form-validator/form-validator.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AuthGuard } from './guard/auth.guard';
import { AllProjectsComponent } from './components/all-projects/all-projects.component';
import { AddProjectsComponent } from './components/admin/add-projects/add-projects.component';
import { LogoutComponent } from './components/admin/logout/logout.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ViewProjectsComponent } from './components/admin/view-projects/view-projects.component';
import { CarrersComponent } from './components/carrers/carrers.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { AddServicesComponent } from './components/admin/add-services/add-services.component';
import { ViewServicesComponent } from './components/admin/view-services/view-services.component';
import { DialogContentComponent } from './components/dialog-content/dialog-content.component';
import { HomeCenterContentComponent } from './components/home-center-content/home-center-content.component';
import { SubNavigationsComponent } from './components/navigation/sub-navigations/sub-navigations.component';
import { IndustrialComponent } from './components/industrial/industrial.component';
import { MunicipalComponent } from './components/municipal/municipal.component';
import { CommercialComponent } from './components/commercial/commercial.component';
import { TimesheetComponent } from './components/admin/timesheet/timesheet.component';
import { HelloComponent } from './components/admin/timesheet/hello.component';
import { ViewTimesheetComponent } from './components/admin/view-timesheet/viewtimesheet.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    IndexComponent,
    ParallexComponent,
    ServicesComponent,
    AboutComponent,
    ProjectsComponent,
    HighlightsComponent,
    ClientsComponent,
    ContactComponent,
    CopyrightComponent,
    LoginComponent,
    FormValidatorComponent,
    DashboardComponent,
    AllProjectsComponent,
    AddProjectsComponent,
    LogoutComponent,
    UploadFileComponent,
    ViewProjectsComponent,
    CarrersComponent,
    NewsletterComponent,
    AddServicesComponent,
    ViewServicesComponent,
    DialogContentComponent,
    HomeCenterContentComponent,
    SubNavigationsComponent,
    IndustrialComponent,
    MunicipalComponent,
    CommercialComponent,
    TimesheetComponent,
    ViewTimesheetComponent,
    HelloComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule.forRoot([
      {
        path: '',
        component: IndexComponent
      },
      {
        path: 'industrial',
        component: IndustrialComponent
      },
      {
        path: 'commercial',
        component: CommercialComponent
      },
      {
        path: 'municipal',
        component: MunicipalComponent
      },
      {
        path: 'projects',
        component: AllProjectsComponent
      },
      {
        path: 'careers',
        component: CarrersComponent
      },
      // {
      //   path: 'newsletters',
      //   component: NewsletterComponent
      // },
      {
        path: 'login',
        component: LoginComponent
      },

       /*  {
        path: 'register',
        component: RegisterComponent
      }, */
      
      {
        path: 'admindashboard',
        component: DashboardComponent,
        data: { roles: ['admin'] },
        canActivate: [AuthGuard],
        children: [
          {
            path: '**',
            redirectTo: '/admindashboard/(sidebar:viewProjects)',
            pathMatch: 'full'
          },
          {
            path: 'viewProjects',
            component: ViewProjectsComponent,
            outlet: 'sidebar'
          },
          {
            path: 'addProjects',
            component: AddProjectsComponent,
            outlet: 'sidebar'
          },
          {
            path: 'viewServices',
            component: ViewServicesComponent,
            outlet: 'sidebar'
          },
          {
            path: 'addServices',
            component: AddServicesComponent,
            outlet: 'sidebar'
          },
          {
            path: 'timesheet',
            component: TimesheetComponent,
            outlet: 'sidebar'
          },
          {
            path: 'logout',
            component: LogoutComponent,
            outlet: 'sidebar'
          }
        ]
      },
      {
        path: 'userdashboard',
        component: DashboardComponent,
        data: { roles: ['user'] },
        canActivate: [AuthGuard],
        children: [
          {
            path: '**',
            redirectTo: '/userdashboard/(sidebar:viewtimesheet)',
            pathMatch: 'full'
          },
          {
            path: 'viewtimesheet',
            component: ViewTimesheetComponent,
            outlet: 'sidebar'
          },
          {
            path: 'timesheet',
            component: TimesheetComponent,
            outlet: 'sidebar'
          },
          {
            path: 'logout',
            component: LogoutComponent,
            outlet: 'sidebar'
          }
        ]
      },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  entryComponents: [DialogContentComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
