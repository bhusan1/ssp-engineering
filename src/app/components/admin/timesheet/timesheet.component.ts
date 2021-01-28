import { Component, OnInit, OnChanges } from "@angular/core";
import { FirebaseService } from "app/services/firebase.service";
import { MatSnackBar } from "@angular/material";
import * as moment from "moment";

@Component({
  selector: "app-timesheet",
  styleUrls: ["./timesheet.component.css"],
  templateUrl: "./timesheet.component.html",
  providers: [FirebaseService],
})
export class TimesheetComponent implements OnInit, OnChanges {
  
  hideResetButton = true;
  totalWeeks: any[];
  days:  any[];
  listofProjects:  any[];
  parentTimesheetForm: any;  
  isAddProjectValid: boolean;

  constructor(
    
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    
   // this.buildForm();
    this.parentTimesheetForm= {};
    this.totalWeeks =  this.getWeeks();
    this.getAllProjects();
    
  }

  ngOnChanges() {
    //this.buildForm();
  }

 
  resetForm() {
    //this.addProjectForm.reset();
    
  }

  buildForm(days:  any[]): void {   
   this.parentTimesheetForm.projects = [{day1: {date: days[0]}, day2: {date: days[1]},day3: {date: days[2]},day4: {date: days[3]},day5: {date: days[4]}, day6: {date: days[5]}, day7:{date: days[6]}}];
  }

  onSubmit(): void {
    console.log("final Object",this.parentTimesheetForm);
  }

  addDataToFirebase(): void {
    const timesheetId = this.parentTimesheetForm.value.timesheetId
      ? this.parentTimesheetForm.value.timesheetId
      : this.firebaseService.createDocumentId();
    const createdAt = this.firebaseService.getFirestoreTimestamp();
    const updatedAt = this.firebaseService.getFirestoreTimestamp();
    const data = timesheetId
      ? { timesheetId, updatedAt, ...this.parentTimesheetForm.value }
      : { timesheetId, createdAt, updatedAt, ...this.parentTimesheetForm.value };
    const fbRef = "/timesheet/" + timesheetId.replace(/\s/g, "");
    const msg = timesheetId ? "Timesheet Updated" : "Timesheet Added";
    if (timesheetId) {
      this.firebaseService.updateFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    } else {
      this.firebaseService.setFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    }
  }

  showToast(msg): void {
    this.snackBar.open(msg, "X", {
      duration: 3000,
    });
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

  getArrayOfDay(startDate){
    const currentDate = moment(startDate,'DD-MM-YYYY')
    //const weekStart = currentDate.clone().startOf('week')

    var days = [];
    for (let i = 0; i <= 6; i++) {

        days.push(moment(currentDate).add(i, 'days').format("MMMM Do,dddd"));


    };

  return days;
    
  }

  getAllProjects() {
    this.firebaseService
      .getFirestoreCollection('/projectList')
      .valueChanges()
      .subscribe((projectData: any[]) => {
        if (projectData) {       
          
          this.listofProjects = projectData;
        }
        
      });
  }

  onChangeofWeek(){
    this.days =  this.getArrayOfDay(this.parentTimesheetForm.selectedWeek.startDate);
    this.buildForm(this.days);
  }

  updateTotal(project: any){
    project.totalHour =  (Number(project.day1.hour) || 0) + (Number(project.day2.hour) || 0) + (Number(project.day3.hour) || 0) + (Number(project.day4.hour) || 0) + (Number(project.day5.hour) || 0) 
    + (Number(project.day6.hour) || 0) + (Number(project.day7.hour) || 0);
    this.isValidPreviousRecord();
  }

  addNewProject(){
    this.parentTimesheetForm.projects.push({day1: {date: this.days[0]}, day2: {date: this.days[1]},day3: {date: this.days[2]},day4: {date: this.days[3]},day5: {date: this.days[4]}, day6: {date: this.days[5]}, day7:{date: this.days[6]}})
  }

  isValidPreviousRecord(){
    const filteredList = this.parentTimesheetForm.projects.filter(obj => {
      if(obj.day1.hour && obj.day2.hour && obj.day3.hour && obj.day4.hour && obj.day5.hour && obj.day6.hour && obj.day7.hour){
        return false;
      }
      return true;
    })
    if(filteredList.length){
      this.isAddProjectValid = false;
    }
    this.isAddProjectValid = true;
  }

}
