import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
//import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor(private store: Store<fromIngresoEgreso.AppState>, public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {

    this.subscription = this.store.select('ingresoEgreso')
                                  .subscribe(ingresoEgreso => {
                                     console.log(ingresoEgreso.items);
                                     this.items = ingresoEgreso.items;
                                    });
  }
  ngOnDestroy() {
   this.subscription.unsubscribe();
  }
  borrarItem(item: IngresoEgreso) {
    console.log(item.uid);
         this.ingresoEgresoService
             .borrarIngresoEgreso(item.uid)
             .then( () => {
              Swal.fire('Eliminado', item.descripcion, 'success');
             });
  }

}
