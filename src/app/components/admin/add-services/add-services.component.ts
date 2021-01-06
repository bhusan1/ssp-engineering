import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from 'app/services/firebase.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css']
})
export class AddServicesComponent implements OnInit, OnChanges {

  addServicesForm: FormGroup;
  imageUrl?: null;
  hideResetButton = true;
  serviceCategoryOptions = [
    { value: 'industrial', viewValue: 'Industrial' },
    { value: 'municipal', viewValue: 'Municipal' },
    { value: 'commercial', viewValue: 'Commercial' }
  ];
  @Input() serviceId: string;
  @Input() title: string;
  @Input() description: string;
  @Input() imageSrc: string;
  @Input() category: string;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    this.buildForm();
  }

  checkIfUpdateIsNeeded(): Boolean {
    if (this.serviceId && this.title && this.description && this.imageSrc) {
      return true;
    }
    return false;
  }

  setImageUrl(projectImageUrlInput: any) {
    this.imageUrl = projectImageUrlInput;
    this.buildForm();
  }

  resetForm() {
    this.addServicesForm.reset();
    this.imageUrl = null;
    this.buildForm();
  }

  buildForm(): void {
    this.addServicesForm = this.fb.group({
      title: [this.title, [Validators.required]],
      serviceCategory: [this.serviceCategoryOptions[0].value, [
        Validators.required]
      ],
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
    const serviceId = this.serviceId ? this.serviceId : this.firebaseService.createDocumentId();
    const createdAt = this.firebaseService.getFirestoreTimestamp();
    const updatedAt = this.firebaseService.getFirestoreTimestamp();
    this.addServicesForm.value.description = this.serviceId ? this.addServicesForm.value.description : this.addServicesForm.value.description.split(',');
    const data = serviceId ? { serviceId, updatedAt, ...this.addServicesForm.value } : { serviceId, createdAt, updatedAt, ...this.addServicesForm.value };
    const fbRef = '/services-test/' + serviceId.replace(/\s/g, '');
    const msg = this.serviceId ? 'Service Updated' : 'Service Added';
    if (this.serviceId) {
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
