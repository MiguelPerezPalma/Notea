import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Ng2SearchPipeModule} from 'ng2-search-filter';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { EditaNotesComponent } from '../Editar/edita-notes/edita-notes.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule
  ],
  declarations: [Tab1Page, EditaNotesComponent],
  entryComponents:[EditaNotesComponent]
})
export class Tab1PageModule {}
