import {Component} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'app/services/auth.service';
import { FirebaseService } from 'app/services/firebase.service';
import * as moment from "moment";

@Component({
  selector: 'app-viewtimesheet',
  styleUrls: ['./viewtimesheet.component.css'],
  templateUrl: './viewtimesheet.component.html',
})
export class ViewTimesheetComponent {

  displayedColumns: string[] = ['projectid','startDate','endDate','day1','day2','day3','day4','day5','day6','day7','totalHour'];
  dataSource: MatTableDataSource<any>;
  noTimesheet = true;
  daysLabel: any;
  employeeName: string;
  parentTimesheetForm: any;
  days: any[];
  totalWeeks: any[];
  listofProjects: any[];
  listofUser: any[];
  selectedWeek: any;
  selectedUser: any;
  isLoading= false;
  currentUser:  any;
  
  constructor(private firebaseService: FirebaseService , private authService: AuthService) { }

  ngOnInit() {
    this.parentTimesheetForm = {};
    this.totalWeeks =  this.getWeeks();
    this.daysLabel = {};
    this.getAllProjects();
    this.getAllUers();
    this.isLoading = true;
    this.authService.userStatusChanges.subscribe(()=>{
      this.isLoading = false;
      this.currentUser =  this.authService.currentUser;
    })
  }

  onChangeofWeek(){
    this.days =  this.getArrayOfDay(this.selectedWeek.startDate);
    this.getTimesheets();
     
  }

  OnchangeOfUser(){
    this.days =  this.getArrayOfDay(this.selectedWeek.startDate);
    this.getTimesheets();
  }

  getTimesheets() {
    if(!this.selectedUser && !this.selectedWeek){
      return;
    }
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/timesheets')
      .ref.where('user', '==', this.selectedUser)
      .where('selectedWeek.startDate', '==', this.selectedWeek.startDate)
      .onSnapshot((snap) => {
        this.isLoading = false;
        if(snap.empty){
          delete this.parentTimesheetForm.projects;
          delete this.parentTimesheetForm.timesheetId
          return;
        }
        snap.forEach(timesheetRef =>{
          console.log("this is document >>",timesheetRef.data());
          this.parentTimesheetForm = timesheetRef.data();        

        })
        
        
      });
  }

  getArrayOfDay(startDate){
    const currentDate = moment(startDate,'DD-MM-YYYY')
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
      let startDateWeek = startDate.isoWeekday("Monday").format("DD-MM-YYYY");
      let endDateWeek = startDate.isoWeekday("Sunday").format("DD-MM-YYYY");
      startDate.add(7, "days");
      weeks.push({ startDate: startDateWeek, endDate: endDateWeek });
    }
    return weeks;
  }

  getAllProjects() {
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/Projects')
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

  getProjectName(projectid){
    return (this.listofProjects.filter(obj=> obj.projectId === projectid)[0] || {}).title;
  }
  

}

