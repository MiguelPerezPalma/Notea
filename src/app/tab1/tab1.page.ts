import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';
import { EditaNotesComponent } from '../Editar/edita-notes/edita-notes.component';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite:IonInfiniteScroll;
  public searchTerm:string;
  public notas:Note[]=[];
  private miLoading:HTMLIonLoadingElement;

  constructor(private ns:NoteService,
    private loading:LoadingController,
    private toast:ToastController,
    private authS:AuthService,
    private router:Router,
    private alerta: AlertController,
    public modal: ModalController) {}

  async ionViewDidEnter(){
    await this.cargaNotas();
  }

  public async borra(nota:Note){
    await this.presentLoading();
    await this.ns.remove(nota.key);
    let i=this.notas.indexOf(nota,0);
    if(i>-1){
      this.notas.splice(i,1);
    }
    await this.miLoading.dismiss();
    //await this.cargaNotas();
  }

  public async cargaNotas(event?){
    if(this.infinite){
      this.infinite.disabled=false;
    }
    if(!event){
      await this.presentLoading();
    }
    this.notas=[];
    try{
      this.notas=await this.ns.getNotesByPage('algo').toPromise();
    }catch(err){
      console.error(err);
      await this.presentToast("Error cargando datos","danger");
    } finally{
      if(event){
        event.target.complete();
      }else{
        await this.miLoading.dismiss();
      }
    }
  }
  public async logout(){
    await this.authS.logout();
    this.router.navigate(['']);
  }
   public async cargaInfinita($event){
    console.log("CARGAND");
    let nuevasNotas=await this.ns.getNotesByPage().toPromise();
    if(nuevasNotas.length<10){
      $event.target.disabled=true;
    }
    this.notas=this.notas.concat(nuevasNotas);
    $event.target.complete();
  }
  async presentLoading() {
    this.miLoading = await this.loading.create({
      message: ''
    });
    await this.miLoading.present();
  }

  async presentToast(msg:string,clr:string) {
    const miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color:clr
    });
    miToast.present();
  }

  public async reproDescripcion(nota:Note){
    await TextToSpeech.speak({
      text: nota.description,
      lang: 'es-ES',
      rate: 1.0,
      
    });
  
}
  
  async edita(nota:Note) {
    const modal = await this.modal.create({
      component: EditaNotesComponent,
      componentProps: {
        nota:nota
      }
    });
    await modal.present();
    const { data:newNote } =await modal.onWillDismiss();
      await this.ns.editNote(newNote);
      this.cargaNotas();
  }




  public async mensagealerta(n:any){
    const alert = await this.alerta.create({
      header: 'Eliminar',
      message: '¿Desea eliminar la nota?',
      buttons: [{
          text: 'Cancelar',
          handler: (blah) => {}},
          {text: 'Eliminar',
          handler: () => {
            this.borra(n)
          }
        }
      ]
    });
   await alert.present();
  }
}
