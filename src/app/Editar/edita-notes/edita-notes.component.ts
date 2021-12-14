import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/Note';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-edita-notes',
  templateUrl: './edita-notes.component.html',
  styleUrls: ['./edita-notes.component.scss'],
})
export class EditaNotesComponent implements OnInit {
  @Input() nota:Note;
  constructor(private modal:ModalController,
    private fb:FormBuilder) { 

    }
  public formularioNota:FormGroup;
  
  ngOnInit() {this.formularioNota = this.fb.group({
    title: ["", Validators.required],
    description: [""]
  });}

  public async editaNota(){
    const coordinates = await Geolocation.getCurrentPosition();
    const newNote=({
      key:this.nota.key,
      title : this.formularioNota.get("title").value,
      description: this.formularioNota.get("description").value,
      latitud:coordinates.coords.latitude,
      longitud:coordinates.coords.longitude
    });
    this.modal.dismiss(newNote);
  }
  
  cancelar(){
    this.modal.dismiss();
  }
}
