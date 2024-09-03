import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import {AngularFirestore, } from '@angular/fire/compat/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { Firestore, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { setDoc, doc, getDoc, addDoc} from 'firebase/firestore';
import { UtilsService } from './utils.service';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject} from 'firebase/storage';


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

  // =========== Obtener documentos de una coleccion ============
  getCollectionData(path: string, collectionQuery?: any){

    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), {idField: 'id'});
    

  } 
  
  // =========== Setear Documento ============
  setDocument(path: string, data:any){

    return setDoc(doc(getFirestore(),path), data);


  }

    // =========== Actualizar un Documento ============
  updateDocument(path: string, data:any){

      return updateDoc(doc(getFirestore(),path), data);
  
  
    }

    // =========== Eliminar un Documento ============
  deleteDocument(path: string){

    return deleteDoc(doc(getFirestore(),path));


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
    async uploadImage(path: string, data_url: string ){
      await uploadString(ref(getStorage(), path), data_url, 'data_url');
      return await getDownloadURL(ref(getStorage(), path));

    }

       // =========== Obtener la ruta de la imagen con su url ============
    async getFilePath( url: string){
        return ref(getStorage(), url).fullPath
        
      }

    // ======= Eliminar Archivo ========
    deleteFile(path: string){

      return deleteObject(ref(getStorage(), path));

    }
}
