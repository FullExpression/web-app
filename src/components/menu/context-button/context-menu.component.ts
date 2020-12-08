import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";

import { ContextMenuLine } from './context-menu-line.model';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    animations: [
        trigger('contextMenuAnimation', [
            state('true', style({
                opacity: 1,
                display: "block",
                "margin-bottom": "0px"
            })),
            state('false', style({
                opacity: 0,
                display: "none",
                "margin-bottom": "-10px"
            })),
            transition('true => false', animate('50ms ease-out')),
            transition('false => true', animate('100ms ease-in'))
        ])
    ]
})
export class ContextMenuComponent {

    @Input()
    showMainMenuOption = true;

    @Input()
    menuLines: Array<ContextMenuLine> = []

    showContextMenuFlag = false;

    backToMenu: ContextMenuLine = {
        description: "Back to Menu",
        callback: () => this.router.navigate(['/'])
    }

    constructor(private router: Router) { }

    showContextMenu() {
        this.showContextMenuFlag = !this.showContextMenuFlag;
    }

    onMenuLineClick(menuContext: ContextMenuLine) {
        this.showContextMenuFlag = false;
        menuContext.callback();
    }
}