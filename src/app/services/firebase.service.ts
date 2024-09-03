import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore, } from '@angular/fire/compat/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { Firestore, collectionData, query } from '@angular/fire/firestore';
import { setDoc, doc, getDoc, addDoc} from 'firebase/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL} from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);
  

  // =========== Autenticacion ============
  getAuth(){
    return getAuth();
  }

  // =========== Cerrar Sesion ============
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }



  // ===== Acceder =====
  signIn(user: User){

    return signInWithEmailAndPassword(getAuth(),user.email, user.password)

  }

   // ===== Crear Usuario =====
  signUp(user: User){

    return createUserWithEmailAndPassword(getAuth(),user.email, user.password)

  }


  // ===== Actualizar Usuario =====

  updateUser(displayName: string){

    return updateProfile(getAuth().currentUser, { displayName});

  }

  // ===== Actualizar Usuario =====
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email)
  }


  // =========== Base de datos ============

  getCollectionData(path: string, collectionQuery?: any){

    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
    

  }

  setDocument(path: string, data:any){

    return setDoc(doc(getFirestore(),path), data);


  }


  // =========== Obtener Documento ============

  async getDocument(path: string){

    return (await getDoc(doc(getFirestore(),path))).data();

    

  }

    // =========== Agregar Documento ============

    async addDocument(path: string, data:any){

      return addDoc(collection(getFirestore(),path), data);
  
  
    }

        // =========== Subir Imagen ============
    uploadImage(path: string, data_url: string ){
      return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
        return getDownloadURL(ref(getStorage(), path))
      })

    }
}
