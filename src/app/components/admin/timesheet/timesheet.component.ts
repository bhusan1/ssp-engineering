import { Component, OnInit, OnChanges } from "@angular/core";
import { FirebaseService } from "app/services/firebase.service";
import { MatSnackBar } from "@angular/material";
import * as moment from "moment";
import { AuthService } from "app/services/auth.service";


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
  isAddProjectValid = false;
  currentUser={};
  selectedWeek: any;
  isLoading = false;

  constructor(
    
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    
   // this.buildForm();
    this.parentTimesheetForm= {};
    this.totalWeeks =  this.getWeeks();
    this.getAllProjects();
    this.isLoading = true;
    this.authService.userStatusChanges.subscribe(()=>{
      this.isLoading = false;
      this.currentUser =  this.authService.currentUser;
    })
    
    
  }

  ngOnChanges() {
    //this.buildForm();
    
  }

 
  resetForm() {
    //this.addProjectForm.reset();
    
  }

  buildForm(days:  any[]): void {   
   this.parentTimesheetForm.projects = this.parentTimesheetForm.projects || [{day1: {date: days[0]}, day2: {date: days[1]},day3: {date: days[2]},day4: {date: days[3]},day5: {date: days[4]}, day6: {date: days[5]}, day7:{date: days[6]}}];
  }

  onSubmit(): void {
    this.addDataToFirebase();
  }

  addDataToFirebase(): void {
    this.isLoading = true;
    const timesheetId = this.parentTimesheetForm.timesheetId
      ? this.parentTimesheetForm.timesheetId
      : this.firebaseService.createDocumentId();
    this.parentTimesheetForm.user = this.authService.currentUser.username;
    const createdAt = this.firebaseService.getFirestoreTimestamp();
    const updatedAt = this.firebaseService.getFirestoreTimestamp();
    const data = timesheetId
      ? { timesheetId, updatedAt, ...this.parentTimesheetForm }
      : { timesheetId, createdAt, updatedAt, ...this.parentTimesheetForm };
    const fbRef = "/timesheet/" + timesheetId.replace(/\s/g, "");
    const msg = this.parentTimesheetForm.timesheetId ? "Timesheet Updated" : "Timesheet Added";
    if (this.parentTimesheetForm.timesheetId) {
      this.firebaseService.updateFirestoreDocument(fbRef, data).then(() => {
        this.isLoading = false;
        this.showToast(msg);
      });
    } else {
      this.firebaseService.setFirestoreDocument(fbRef, data).then(() => {
        this.isLoading = false;
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

  getTimesheets() {
    this.isLoading = true;
    this.firebaseService
      .getFirestoreCollection('/timesheet')
      .ref.where('user', '==', this.authService.currentUser.username)
      .where('selectedWeek.startDate', '==', this.selectedWeek.startDate)
      .onSnapshot((snap) => {
        this.isLoading = false;
        if(snap.empty){
          delete this.parentTimesheetForm.projects;
          delete this.parentTimesheetForm.timesheetId;
          this.buildForm(this.days);
          return;
        }
        snap.forEach(timesheetRef =>{
          console.log("this is document >>",timesheetRef.data());
          this.parentTimesheetForm = timesheetRef.data();                

        })
        
        
      });
  }

  onChangeofWeek(){
    this.days =  this.getArrayOfDay(this.selectedWeek.startDate);
    this.getTimesheets();
    this.buildForm(this.days);    
  }

  

  getObjFrom(data){
    return this.totalWeeks.filter(obj=> obj.startDate == data.selectedWeek.startDate);
  }

  updateTotal(project: any){
    project.totalHour =  (Number(project.day1.hour) || 0) + (Number(project.day2.hour) || 0) + (Number(project.day3.hour) || 0) + (Number(project.day4.hour) || 0) + (Number(project.day5.hour) || 0) 
    + (Number(project.day6.hour) || 0) + (Number(project.day7.hour) || 0);
    this.isValidPreviousRecord();
  }

  addNewProject(){
    this.parentTimesheetForm.projects.push({day1: {date: this.days[0]}, day2: {date: this.days[1]},day3: {date: this.days[2]},day4: {date: this.days[3]},day5: {date: this.days[4]}, day6: {date: this.days[5]}, day7:{date: this.days[6]}})
    this.isValidPreviousRecord();
  }

  isValidPreviousRecord(){
    let flag = true;
    this.parentTimesheetForm.projects.filter(obj => {
      if(!obj.day1.hour || !obj.day2.hour || !obj.day3.hour || !obj.day4.hour || !obj.day5.hour || !obj.day6.hour || !obj.day7.hour){
        flag = false;
      }      
    })
    if(flag){
      this.isAddProjectValid = true;
    }else{
      this.isAddProjectValid = false;
    }
  }

  getProjectList(project){
    return this.listofProjects.filter(obj=> obj.projectId ==project && this.parentTimesheetForm.projects.indexOf(obj.projectId) !==-1 );
  }

}
