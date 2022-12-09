import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

// import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolsComponent } from './dashboard/tools/tools.component';
import { IntentComponent } from './dashboard/intent/intent.component';
import { TextResponseComponent } from './dashboard/intent/response-types/text-response/text-response.component';
import { DelaySliderComponent } from './dashboard/intent/elements/delay-slider/delay-slider.component';
import { ButtonConfigurationPanelComponent } from './dashboard/button-configuration-panel/button-configuration-panel.component';
import { ImageResponseComponent } from './dashboard/intent/response-types/image-response/image-response.component';
import { FrameResponseComponent } from './dashboard/intent/response-types/frame-response/frame-response.component';
import { ImagePanelComponent } from './dashboard/intent/elements/image-panel/image-panel.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolsComponent,
    IntentComponent,
    TextResponseComponent,
    DelaySliderComponent,
    ButtonConfigurationPanelComponent,
    ImageResponseComponent,
    FrameResponseComponent,
    ImagePanelComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    NgSelectModule,
    TextFieldModule,
    MatSliderModule,
    MatSelectModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    MatInputModule
  ]
})
export class ChatbotDashboardModule { }