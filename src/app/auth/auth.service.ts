import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {Store} from '@ngrx/store';


import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { User } from './user.model';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction,DesactivarLoadingAction } from '../shared/ui.accions';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription:Subscription = new Subscription();
  private usuario: User;

  constructor(private aFAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore,private store: Store<AppState>) { }

  initAuthListener(){
    this.aFAuth.authState.subscribe( (fbUser: firebase.User) => {
       if (fbUser) {
         this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
                                              .subscribe((usuarioObj: any) => {
                                                
                                              const newUser = new User(usuarioObj);
                                              //console.log('objeto que se envia:' + newUser);
                                              this.store.dispatch(new SetUserAction(newUser));
                                              //console.log(newUser);
                                              this.usuario = newUser;


                                              });
       } else {

        this.usuario = null;
        this.userSubscription.unsubscribe();

       }

    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
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
                    this.store.dispatch(new DesactivarLoadingAction());
                   });

        })
        .catch( error => {
          console.error(error);
          this.store.dispatch(new DesactivarLoadingAction());
          swal.fire('Error en el registro de usuarios', error.message, 'error');
        });
  }

  login(email: string, password: string){

     this.store.dispatch(new ActivarLoadingAction());
     this.aFAuth.auth.signInWithEmailAndPassword(email, password)
                     .then(resp => {
                    //  console.log(resp);
                      this.store.dispatch(new DesactivarLoadingAction());
                      this.router.navigate(['/']);
                      })
                     .catch( error => {
                      console.error(error);
                      this.store.dispatch(new DesactivarLoadingAction());
                      swal.fire('Error en el login',error.message,'error');
                     });
  }
  logout(){

    this.router.navigate(['/login']);
    this.aFAuth.auth.signOut();
    this.store.dispatch(new UnsetUserAction());
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

  getUsuario(){
   return {...this.usuario};
  }

}
