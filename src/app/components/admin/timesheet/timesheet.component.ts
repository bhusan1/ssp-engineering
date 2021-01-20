import { Component, OnInit, OnChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
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
  addProjectForm: FormGroup;
  parentTimesheetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    
    this.buildForm();
    this.totalWeeks =  this.getWeeks();
    this.getAllProjects();
    
  }

  ngOnChanges() {
    this.buildForm();
  }

 
  resetForm() {
    //this.addProjectForm.reset();
    this.buildForm();
  }

  get t(){return  this.parentTimesheetForm.controls.addTimesheet as FormArray}

  buildForm(): void {
    this.parentTimesheetForm = this.fb.group({
      selectedWeek:  ['',[Validators.required]],
      addTimesheet:  new FormArray([])
    })
    this.t.push(this.addProjectForm);
    this.addProjectForm = this.fb.group({
      projectName: ['', [Validators.required]],
      
      employeeName: ['', [Validators.required]],
      day1 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day2 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day3 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day4 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day5 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day6 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      }),
      day7 : this.fb.group({
        hour: ['',[Validators.required]],
        date:  ['',[Validators.required]],
        comment: ['',[Validators.required]]
      })
      
    });
  }

  onSubmit(): void {
    console.log("final Object",this.parentTimesheetForm.value);
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

  getTotal() {

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
    this.days =  this.getArrayOfDay(this.parentTimesheetForm.value.selectedWeek.startDate);
  }
}
