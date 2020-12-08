import { Component } from '@angular/core';
import { NvarModel } from '@fullexpression/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    nvarBarElements: NvarModel = {
        routeLinks: [
            { name: "Detect Emotion From Web Cam", link: '/detect-emotion-from-webcam' },
            { name: "Detect Emotion From Images", link: '/detect-emotion-from-image' }
        ]
    }
    ngOnInit() { }
}
