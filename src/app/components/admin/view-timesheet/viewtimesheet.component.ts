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

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  ngOnInit() {
    this.parentTimesheetForm = {};
    this.totalWeeks = this.getWeeks();
    this.daysLabel = {};
    this.getAllProjects();
    this.getAllUers();
    this.getClients();
    this.isLoading = true;
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
    this.getTimesheets('projectName', this.selectedProject);
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
        this.isLoading = false;
        if (snap.empty) {
          delete this.parentTimesheetForm.projects;
          delete this.parentTimesheetForm.timesheetId
          return;
        }
        snap.forEach(timesheetRef => {
          console.log("this is document >>", timesheetRef.data());
          this.parentTimesheetForm = timesheetRef.data();

        })


      });
  }

  getArrayOfDay(startDate) {
    const currentDate = moment(startDate, "MM-DD-YYYY")
    //const weekStart = currentDate.clone().startOf('week')

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

  getAllProjects() {
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/projectList')
      .valueChanges()
      .subscribe((projectData: any[]) => {
        this.isLoading = false;
        if (projectData) {

          this.listofProjects = projectData;
        }

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
    return (this.listofProjects.filter(obj => obj.projectId === projectid)[0] || {}).title;
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


}

