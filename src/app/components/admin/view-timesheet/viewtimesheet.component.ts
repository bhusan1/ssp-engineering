import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/services/auth.service';
import { FirebaseService } from 'app/services/firebase.service';
import * as moment from "moment";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-viewtimesheet',
  styleUrls: ['./viewtimesheet.component.css'],
  templateUrl: './viewtimesheet.component.html',
})
export class ViewTimesheetComponent {

  displayedColumns: string[] = ['projectid', 'startDate', 'endDate', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7', 'totalHour'];
  dataSource: MatTableDataSource<any>;
  noTimesheet = true;
  daysLabel: any;
  employeeName: string;
  parentTimesheetForm: any;
  days: any[];
  totalWeeks: any[];
  listofProjects: any[];
  listofUser: any[];
  listofClient:  any[];
  selectedWeek: any;
  selectedUser: any;
  isLoading = false;
  currentUser: any;
  filterType: any;
  selectedProject: String;
  selectedClient: any;
  fullListOfProjects: any[];


  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  ngOnInit() {
    this.parentTimesheetForm = {};
    this.totalWeeks = this.getWeeks();
    this.daysLabel = {};    
    this.getAllUers();
    this.getClients();
    this.getFullProjectList();
    this.isLoading = true;
    this.listofProjects = [];
    this.authService.userStatusChanges.subscribe(() => {
      this.isLoading = false;
      this.currentUser = this.authService.currentUser;
    })
  }

  onChangeofWeek() {
    this.days = this.getArrayOfDay(this.selectedWeek.startDate);
    if (this.selectedUser || this.selectedProject) {
      this.getTimesheets();
    }

  }

  OnchangeOfUser() {
    this.days = this.getArrayOfDay(this.selectedWeek.startDate);
    this.getTimesheets('user', this.selectedUser);
  }

  OnchangeOfClient(clientId){
    this.getAllProjects(clientId);
    this.getTimesheetByProjectIdAndClientId();
  }

  getFullProjectList(){
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/projectList')
      .valueChanges()
      .subscribe(projectList =>{
        this.fullListOfProjects = projectList;
      });      
  }  

  getClients(){
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/clients')
      .valueChanges()
      .subscribe((client: any[]) => {
        this.isLoading = false;
        if (client) {
          this.listofClient = client;
        }        
      });
  }

  OnchangeOfProject() {
    this.days = this.getArrayOfDay(this.selectedWeek.startDate);
    this.getTimesheetByProjectIdAndClientId();
  }

  getTimesheets(key?, value?) {
    if (!this.selectedUser && !this.selectedWeek) {
      return;
    }
    this.isLoading = true;

    this.firebaseService
      .getFirestoreCollection('/timesheet')
      .ref.where(key || 'projectName', '==', value || "")
      .where('selectedWeek.startDate', '==', this.selectedWeek.startDate)
      .onSnapshot((snap) => {
        this.parentTimesheetForm.projects = [];
        this.isLoading = false;
        if (snap.empty) {
          delete this.parentTimesheetForm.projects;
          delete this.parentTimesheetForm.timesheetId
          return;
        }
        snap.forEach(timesheetRef => {
          this.parentTimesheetForm.projects.push(timesheetRef.data().projeects);
        })


      });
  }

  getArrayOfDay(startDate) {
    const currentDate = moment(startDate, "MM-DD-YYYY")   

    var days = [];
    for (let i = 0; i <= 6; i++) {

      days.push(moment(currentDate).add(i, 'days').format("MMMM Do,dddd"));
    };

    return days;

  }

  getWeeks() {
    var weeks = [];
    var startDate = moment(new Date(2021, 0, 1)).isoWeekday(8);
    if (startDate.date() == 8) {
      startDate = startDate.isoWeekday(-6);
    }
    var today = moment().isoWeekday("Sunday");
    while (startDate.isBefore(today)) {
      let startDateWeek = startDate.isoWeekday("Monday").format("MM-DD-YYYY");
      let endDateWeek = startDate.isoWeekday("Sunday").format("MM-DD-YYYY");
      startDate.add(7, "days");
      weeks.push({ startDate: startDateWeek, endDate: endDateWeek });
    }
    return weeks;
  }

  getAllProjects(clientId) {
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/projectList')
      .ref.where('clientId', '==', clientId)
      .onSnapshot((snap) => {
        this.isLoading = false;
        this.listofProjects = [];
        if(snap.empty){
          this.listofProjects = [];          
          return;
        }        
        snap.forEach(projectRef => {     
          this.listofProjects.push(projectRef.data());          
        })

      });
  }

  getAllUers() {
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/users')
      .valueChanges()
      .subscribe((userData: any[]) => {
        this.isLoading = false;
        if (userData) {
          this.listofUser = userData;
        }

      });
  }

  getProjectName(projectid) {
    return (this.fullListOfProjects.filter(obj => obj.projectId === projectid)[0] || {}).title;
  }

  getClientName(clientId){
    return (this.listofClient.filter(obj => obj.clientId === clientId)[0] || {}).clientName;
  }

  fileName = 'TimeSheetReports.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'timesheet');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  radioChange()
  {
    this.selectedUser = null;
    this.selectedProject = null;
    this.parentTimesheetForm = {};
  }

  getTimesheetByProjectIdAndClientId(){
    if (!this.selectedWeek) {
      return;
    }
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/timesheet')
      .ref.where('selectedWeek.startDate', '==', this.selectedWeek.startDate)
      .onSnapshot((snap) => {
        this.isLoading = false;
        this.parentTimesheetForm.projects = [];
        if (snap.empty) {
          delete this.parentTimesheetForm.projects;
          delete this.parentTimesheetForm.timesheetId
          return;
        }
        snap.forEach(timesheetRef => {
          console.log("this is document >>", timesheetRef.data());
          this.parentTimesheetForm.selectedWeek = timesheetRef.data().selectedWeek;          
          this.parentTimesheetForm.projects = (this.parentTimesheetForm.projects || []).concat(timesheetRef.data().projects);
        })
        this._getFilterByclientIdAndProjectId();

      });
  }

  _getFilterByclientIdAndProjectId(){
    this.parentTimesheetForm.projects = (this.parentTimesheetForm.projects || []).filter(obj => {
      if(this.selectedClient && this.selectedProject && (this.selectedProject !== "1")){
        if(obj.clientId == this.selectedClient && obj.projectName == this.selectedProject){
          return true;
        }
      }else if(this.selectedClient || this.selectedProject == "1"){
        if(obj.clientId == this.selectedClient){
          return true;
        }
      }
      return false;
    })
    console.log("ttestt >>",this.parentTimesheetForm);
  }


}

