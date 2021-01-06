import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as firebase from 'firebase/app';
import { FileUploadService } from 'app/services/file-upload.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  constructor(private uploadService: FileUploadService) {
    this.uploadUrl = null;
  }

  percentUploaded = 0;
  bufferValue = 75;
  uploadUrl: string;
  showProgressBar = false;
  fileName: string = null;
  modifiedFileName: string = null;
  fileDescription: string = null;
  fileEvent: any;
  disableSubmit = true;
  @Output() projectImageUploaded = new EventEmitter<string>();
  ngOnInit() {}

  getFile($event: any): void {
    this.fileEvent = $event;
    this.disableSubmit = false;
    this.fileDescription = null;
    this.uploadUrl = null;
    this.showProgressBar = false;
  }

  uploadFile(): void {
    this.showProgressBar = true;
    this.disableSubmit = true;
    this.fileName = this.fileEvent.target.files[0].name;
    const uploadTask = this.uploadService.uploadFile(this.fileEvent.target.files[0]);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: any) => {
        this.percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.uploadUrl = null;
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
          this.uploadUrl = downloadUrl;
          this.passImageLinkToAddProjects(this.uploadUrl);
          if (!this.fileDescription) {
            this.fileDescription = uploadTask.snapshot.metadata.name;
          }
          this.modifiedFileName = uploadTask.snapshot.metadata.name;
          this.fileEvent.target.value = '';
          this.fileDescription = null;
        });
      }
    );
  }

  submitForm(event: any) {
    if (event.keyCode === 13) {
      if (this.fileEvent) {
        this.uploadFile();
      }
    }
  }

  passImageLinkToAddProjects(url: string): void {
    this.projectImageUploaded.emit(url);
  }
}
