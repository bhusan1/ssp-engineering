import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(public firestore: AngularFirestore) {}

  updateFirestoreDocument(reference: string, data: any): Promise<void> {
    return this.firestore.doc(reference).update(data);
  }

  setFirestoreDocument(reference: string, data: any): Promise<void> {
    return this.firestore.doc(reference).set(data);
  }

  getFirestoreCollection(collectionRef: string, query?: QueryFn): AngularFirestoreCollection<any> {
    return this.firestore.collection(collectionRef, query);
  }

  getFirestoreDocument(collection: string, document: string) {
    return this.firestore
      .collection(collection)
      .doc(document)
      .ref.get();
  }

  createDocumentId(): string {
    return this.firestore.createId();
  }

  getFirestoreTimestamp(): firebase.firestore.FieldValue {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}
