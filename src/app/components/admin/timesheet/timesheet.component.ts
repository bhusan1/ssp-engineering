import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  addProjectForm: FormGroup;
  hideResetButton = true;
  totalWeeks: any[];
  days:  any[];
  listofProjects:  any[];
  @Input() selectedWeek: any;
  @Input() projectId: string;
  @Input() employeeName: string;
  @Input() title: string;
  @Input() monday: number;
  @Input() mondayRemarks: string;
  @Input() tuesday: number;
  @Input() tuesdayRemarks: string;
  @Input() wednesday: number;
  @Input() wednesdayRemarks: string;
  @Input() thrusday: number;
  @Input() thrusdayRemarks: string;
  @Input() friday: number;
  @Input() fridayRemarks: string;
  @Input() saturday: number;
  @Input() saturdayRemarks: string;
  @Input() sunday: number;
  @Input() sundayRemarks: string;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.monday = this.tuesday = this.wednesday = this.thrusday = this.friday = this.saturday = this.sunday = 0;
    this.buildForm();
    this.totalWeeks =  this.getWeeks();
    this.getAllProjects();
  }

  ngOnChanges() {
    this.buildForm();
  }

  checkIfUpdateIsNeeded(): Boolean {
    if (
      this.projectId &&
      this.employeeName &&
      this.title &&
      this.monday &&
      this.mondayRemarks &&
      this.tuesday &&
      this.tuesdayRemarks &&
      this.wednesday &&
      this.wednesdayRemarks &&
      this.thrusday &&
      this.thrusdayRemarks &&
      this.friday &&
      this.fridayRemarks &&
      this.saturday &&
      this.saturdayRemarks &&
      this.sunday &&
      this.sundayRemarks
    ) {
      return true;
    }
    return false;
  }

  resetForm() {
    this.addProjectForm.reset();
    this.buildForm();
  }

  buildForm(): void {
    this.addProjectForm = this.fb.group({
      title: [this.title, [Validators.required]],
      selectedWeek:  [this.selectedWeek,[Validators.required]],
      employeeName: [this.employeeName, [Validators.required]],

      monday: [this.monday, [Validators.required]],
      mondayRemarks: [this.mondayRemarks],

      tuesday: [this.tuesday, [Validators.required]],
      tuesdayRemarks: [this.tuesdayRemarks],

      wednesday: [this.wednesday, [Validators.required]],
      wednesdayRemarks: [this.wednesdayRemarks],

      thrusday: [this.thrusday, [Validators.required]],
      thrusdayRemarks: [this.thrusdayRemarks],

      friday: [this.friday, [Validators.required]],
      fridayRemarks: [this.fridayRemarks],

      saturday: [this.saturday, [Validators.required]],
      saturdayRemarks: [this.saturdayRemarks],

      sunday: [this.sunday, [Validators.required]],
      sundayRemarks: [this.sundayRemarks],
    });
  }

  onSubmit(): void {
    if (this.checkIfUpdateIsNeeded) {
      this.addDataToFirebase();
    }
  }

  addDataToFirebase(): void {
    const projectId = this.projectId
      ? this.projectId
      : this.firebaseService.createDocumentId();
    const createdAt = this.firebaseService.getFirestoreTimestamp();
    const updatedAt = this.firebaseService.getFirestoreTimestamp();
    const data = projectId
      ? { projectId, updatedAt, ...this.addProjectForm.value }
      : { projectId, createdAt, updatedAt, ...this.addProjectForm.value };
    const fbRef = "/timesheet/" + projectId.replace(/\s/g, "");
    const msg = this.projectId ? "Timesheet Updated" : "Timesheet Added";
    if (this.projectId) {
      this.firebaseService.updateFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    } else {
      this.firebaseService.setFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    }
  }

  /* addRow() {
    this.addProjectForm.data.push(this.createNewUser(this.dataSource.data.length + 1));
    this.dataSource.filter = "";
  } */

  showToast(msg): void {
    this.snackBar.open(msg, "X", {
      duration: 3000,
    });
  }

  getTotal() {
    return (
      this.monday +
      this.tuesday +
      this.wednesday +
      this.thrusday +
      this.friday +
      this.saturday +
      this.sunday
    );
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
      .getFirestoreCollection('/projects')
      .valueChanges()
      .subscribe((projectData: any[]) => {
        if (projectData) {       
          
          this.listofProjects = projectData;
        }
        
      });
  }

  onChangeofWeek(){
    this.days =  this.getArrayOfDay(this.selectedWeek.startDate);
  }
}
