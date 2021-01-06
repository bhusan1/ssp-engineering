import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from 'app/services/firebase.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css'],
  providers: [FirebaseService]
})
export class AddProjectsComponent implements OnInit, OnChanges {
  addProjectForm: FormGroup;
  imageUrl?: null;
  hideResetButton = true;
  @Input() projectId: string;
  @Input() title: string;
  @Input() description: string;
  @Input() imageSrc: string;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    this.buildForm();
  }

  checkIfUpdateIsNeeded(): Boolean {
    if (this.projectId && this.title && this.description && this.imageSrc) {
      return true;
    }
    return false;
  }

  setImageUrl(projectImageUrlInput: any) {
    this.imageUrl = projectImageUrlInput;
    this.buildForm();
  }

  resetForm() {
    this.addProjectForm.reset();
    this.imageUrl = null;
    this.buildForm();
  }

  buildForm(): void {
    this.addProjectForm = this.fb.group({
      title: [this.title, [Validators.required]],
      description: [this.description, [Validators.required]],
      imageSrc: [this.imageSrc || this.imageUrl, [Validators.required, Validators.pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)]]
    });
  }

  onSubmit(): void {
    if (this.checkIfUpdateIsNeeded) {
      this.addDataToFirebase();
    }
  }

  addDataToFirebase(): void {
    const projectId = this.projectId ? this.projectId : this.firebaseService.createDocumentId();
    const createdAt = this.firebaseService.getFirestoreTimestamp();
    const updatedAt = this.firebaseService.getFirestoreTimestamp();
    const data = projectId ? {projectId, updatedAt, ...this.addProjectForm.value} : {projectId, createdAt, updatedAt, ...this.addProjectForm.value};
    const fbRef = '/projects/' + projectId.replace(/\s/g, '');
    const msg = this.projectId ? 'Project Updated' : 'Project Added';
    if (this.projectId) {
      this.firebaseService.updateFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    }
    else {
      this.firebaseService.setFirestoreDocument(fbRef, data).then(() => {
        this.showToast(msg);
      });
    }
  }

  showToast(msg): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000
    });
  }
}
