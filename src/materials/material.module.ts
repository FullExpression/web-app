import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
    imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
        MatStepperModule, MatButtonModule, MatRadioModule, MatSelectModule, MatCardModule,
        MatProgressSpinnerModule, MatIconModule, MatCheckboxModule],
    exports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
        MatStepperModule, MatButtonModule, MatRadioModule, MatSelectModule, MatCardModule,
        MatProgressSpinnerModule, MatIconModule, MatCheckboxModule]
})
export class MaterialModule { }