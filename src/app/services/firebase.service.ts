import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { getFirestore } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  

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

  setDocument(path: string, data:any){

    return setDoc(doc(getFirestore(),path), data);


  }


  // =========== Obtener Documento ============

  async getDocument(path: string){

    return (await getDoc(doc(getFirestore(),path))).data();

    

  }
}
