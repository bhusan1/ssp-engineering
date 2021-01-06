import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireList } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fbRef: AngularFireList<any>;
  private basePath = '/fileUploads';
  match = false;

  constructor() { }

  uploadFile(filePayload: any): firebase.storage.UploadTask {
    this.basePath = '/';
    const fileName = this.getFileName(filePayload.name);
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${fileName}`).put(filePayload);
  }

  getFileName(fileName: string) {
    const fileExtension = fileName.split('.').pop();
    const extractedFileName = fileName.substr(0, fileName.lastIndexOf('.'));
    return extractedFileName + '-' + new Date().toISOString() + '.' + fileExtension;
  }
}
