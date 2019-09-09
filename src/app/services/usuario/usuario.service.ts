import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "../../models/usuario.model";
import { environment } from "../../../environments/environment.prod";
import { map } from "rxjs/operators";
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class UsuarioService {

  usuario: string;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router
    ) {
    this.cargarStorage();
  }

  estaLoggeado(){
    return (this.token.length > 5) ? true: false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if ( recordar ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    
    let url = environment.URL_SERVICIOS + 'login';
    return this.http.post(url, usuario)
                    .pipe(map ( (resp: any) => {
                      localStorage.setItem('id', resp.id);
                      localStorage.setItem('token', resp.token);
                      localStorage.setItem('usuario', JSON.stringify(resp.usuario));

                      this.token = localStorage.getItem('token');
                      this.usuario = localStorage.getItem('usuario');

                      return true;
                    }));

    usuario.email
    usuario.password
  }

  logout() {
    this.usuario='';
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }


  crearUsuario(usuario: Usuario) {
    let url = environment.URL_SERVICIOS + "usuario";

    return this.http.post(url, usuario).pipe(map( (res: any) => {
      swal('Usuario creado', usuario.email, 'success');
      return res.usuario;
    }));
  }
}
