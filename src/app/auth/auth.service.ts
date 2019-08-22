import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { User } from './user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private aFAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener(){
    this.aFAuth.authState.subscribe( (fbUser: firebase.User) => {
       console.log(fbUser);

    });
  }

  crearUsuario(nombre: string, email: string, password: string){
    this.aFAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(resp => {
        // console.log(resp);
         const user: User = { 
           uid: resp.user.uid,
           nombre: nombre,
           email: resp.user.email
         };
         this.afDB.doc(`${ user.uid }/usuario`)
                  .set(user)
                  .then (() => {
                    this.router.navigate(['/']);
                   });

        })
        .catch( error => {
          console.error(error);
          swal.fire('Error en el registro de usuarios', error.message, 'error');
        });
  }

  login(email: string, password: string){
     this.aFAuth.auth.signInWithEmailAndPassword(email, password)
                     .then(resp => {
                    //  console.log(resp);
                      this.router.navigate(['/']);
                      })
                     .catch( error => {
                      console.error(error);
                      swal.fire('Error en el login',error.message,'error');
                     });
  }
  logout(){
    this.router.navigate(['/login']);
    this.aFAuth.auth.signOut();
  }
  isAuth() {
   return this.aFAuth.authState
                     .pipe(
                      map(fbUser => {
                        if (fbUser == null){
                            this.router.navigate(['/login']);
                        }
                        return  fbUser != null;
                      })
                      );
  }
}
