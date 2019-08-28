import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {filter} from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre: string;
  subscription: Subscription;

  constructor(public authService:AuthService, private store: Store <AppState>,public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
    .pipe(
      filter(auth => auth.user != null)
     )
    .subscribe( auth => this.nombre = auth.user.nombre);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  logout(){
    this.authService.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

}
