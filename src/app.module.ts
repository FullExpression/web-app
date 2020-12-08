import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './materials/material.module';
import { Routes, RouterModule } from '@angular/router';
import { EmotionClassificationModule } from '@fullexpression/emotion-classification';
import { ChartsModule } from 'ng2-charts';
import { DetectEmotionFromWebcam } from './components/detect-emotion-from-webcam/detect-emotion-from-webcam.component';
import { DetectEmotionFromImageComponent } from './components/detect-emotion-from-image/detect-emotion-from-image.component';
import { FormsModule } from '@angular/forms';
import { ConfusionMatrixModule } from '@fullexpression/confusion-matrix';
import { CoreModule } from '@fullexpression/core';
import { ContextMenuComponent } from './components/menu/context-button/context-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    { path: '', component: MenuComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'detect-emotion-from-webcam', component: DetectEmotionFromWebcam },
    { path: 'detect-emotion-from-image', component: DetectEmotionFromImageComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        DetectEmotionFromWebcam,
        DetectEmotionFromImageComponent,
        ContextMenuComponent,
        MenuComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        ChartsModule,
        RouterModule.forRoot(routes),
        ConfusionMatrixModule,
        CoreModule.forRoot(),
        EmotionClassificationModule.forRoot(),
        CommonModule

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
