import { Component } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [
        trigger('menuHover', [
            state('true', style({
                opacity: 1,
                filter: "blur(3px)",
                transform: "scale(1.02)"
            })),
            state('false', style({
                opacity: 1,
                filter: "blur(0px)",
                transform: "scale(1.0)"
            })),
            transition('true => false', animate('250ms ease-out')),
            transition('false => true', animate('250ms ease-in'))
        ]),
        trigger('descriptionHover', [
            state('true', style({
                transform: "scale(1.12)"
            })),
            state('false', style({
                transform: "scale(1.0)"
            })),
            transition('true => false', animate('250ms ease-out')),
            transition('false => true', animate('250ms ease-in'))
        ])
    ]
})
export class MenuComponent {
    webCamHover = false;
    fromImages = false;
    constructor(private router: Router) { }
    redirectToWebCam() {
        this.router.navigate(['/detect-emotion-from-webcam']);
    }
    redirectToFromImages() {
        this.router.navigate(['/detect-emotion-from-image']);
    }
}