import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, HostListener, OnDestroy } from "@angular/core";
import { WebCamComponent } from "@fullexpression/core";
import { FacesService } from "@fullexpression/emotion-classification";
import { CanvasService } from "@fullexpression/core";
import { Size } from "@fullexpression/core";
import { EmotionService } from "@fullexpression/emotion-classification";
import { Rectangle } from "@fullexpression/core";
import { Observable, of, Subject } from "rxjs";

@Component({
    selector: 'detect-emotion-from-webcam',
    templateUrl: './detect-emotion-from-webcam.component.html',
    styleUrls: ['./detect-emotion-from-webcam.component.scss']
})
export class DetectEmotionFromWebcam implements OnInit, OnDestroy {

    @ViewChild("bodyWrapper", { static: false })
    bodyWrapper!: ElementRef;

    @ViewChild("imageElement", { static: false })
    imageElement!: ElementRef;

    @ViewChild("webCamComponent", { static: false })
    webCamComponent!: WebCamComponent;


    isLoading = true;


    webcamWidth = 0;
    webcamHeight = 0;
    webCamLeft = 0;

    isFaceDetectionChecked = false;
    isEmotionDetectionChecked = false;
    loadingMessage = '';

    isFullScreenMode = false;
    imageUrl = '';
    private waitForWebCam: Subject<void> = new Subject();
    private isWebCamReady = false;




    faces = new Array<Rectangle>();

    constructor(private facesService: FacesService,
        private canvasService: CanvasService,
        private emotionService: EmotionService) { }

    ngOnDestroy(): void { }

    ngOnInit(): void {
        this.loadingMessage = "Loading emotion service...";
        this.emotionService.initialize().subscribe(() => {
            this.loadingMessage = "Initializing webcam...";
            this.onWebCamReady().subscribe(() => {
                this.setWebCamSize(this.bodyWrapper.nativeElement.offsetWidth,
                    this.bodyWrapper.nativeElement.offsetHeight);
                setTimeout(() => {
                    this.webCamLeft = this.webCamComponent.getVideoBoundingClientRect()?.left || 0;
                })

                this.isLoading = false;
                this.loadingMessage = "";
            });
        });


    }

    toogleFullScreen(): void {
        if (!document["fullscreenElement"]) {
            this.isFullScreenMode = true;
            let elem = this.bodyWrapper.nativeElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            setTimeout(() => {
                this.setWebCamSize(window.innerWidth, window.innerHeight);
            }, 100);

        } else {
            if (document["exitFullscreen"]) {
                this.isFullScreenMode = false;
                document["exitFullscreen"]();
                setTimeout(() => {
                    this.setWebCamSize(this.bodyWrapper.nativeElement.offsetWidth,
                        this.bodyWrapper.nativeElement.offsetHeight);
                }, 100);

            }
        }
    }

    toogleFaceDetection(): void {
        this.isFaceDetectionChecked = !this.isFaceDetectionChecked;
        if (this.isFaceDetectionChecked) {
            this.startFaceDetection();
        } else {
            this.stopFaceDetection();
        }

    }

    toogleEmotionDetection(): void {
        this.isEmotionDetectionChecked = !this.isEmotionDetectionChecked;
        if (this.isEmotionDetectionChecked) {
            this.isFaceDetectionChecked = true
            this.startFaceDetection();
        }
    }

    startFaceDetection(): void {
        this.isFaceDetectionChecked = true;
        setTimeout(() => {
            this.detectFace().then(() => {
                if (this.isFaceDetectionChecked) {
                    this.startFaceDetection();
                }
            })
        });


    }
    stopFaceDetection(): void {
        this.isFaceDetectionChecked = false;
        this.isEmotionDetectionChecked = false;
    }

    setWebCamStatusToReady(): void {
        this.isWebCamReady = true;
        this.waitForWebCam.next();
    }


    private onWebCamReady(): Observable<void> {
        if (this.isWebCamReady) {
            return of();
        }
        return this.waitForWebCam;
    }


    @HostListener('window:resize', ['$event'])
    private sizeChange(): void {
        this.setWebCamSize(window.innerWidth, window.innerHeight);
    }

    private setWebCamSize(width: number, height: number): void {
        this.webcamWidth = width;
        this.webcamHeight = height;
        this.webCamLeft = this.webCamComponent.getVideoBoundingClientRect()?.left || 0;
    }

    private detectFace(): Promise<void> {
        return new Promise<void>((resolve) => {
            let canvas: HTMLCanvasElement = this.webCamComponent.getImage(true) as HTMLCanvasElement;
            let resizeFactor = 0;
            if (canvas.width > canvas.height) {
                resizeFactor = 300 / canvas.width;
            } else {
                resizeFactor = 300 / canvas.height;
            }
            const resizedCanvas = this.canvasService.resizeCanvas(
                canvas, new Size(canvas.width * resizeFactor, canvas.height * resizeFactor)
            );
            if (resizedCanvas) {
                this.facesService.findFace(resizedCanvas).then((rectangles: Array<Rectangle>) => {
                    if (rectangles && rectangles.length > 0) {
                        rectangles.forEach((rectangle) => {
                            if (this.isEmotionDetectionChecked) {
                                let imageUrl = this.canvasService.getImage(resizedCanvas, rectangle, false, false) as string;
                                this.emotionService.getEmotion(imageUrl).subscribe((classification) => {
                                    rectangle.text.text = classification.classificationLabel;
                                    rectangle.text.icon = classification.icon;
                                    this.faces = [];
                                    this.faces.push(new Rectangle().setByScale(1 / resizeFactor, rectangle));
                                    resolve();
                                });
                            } else {
                                this.faces = [];
                                this.faces.push(new Rectangle().setByScale(1 / resizeFactor, rectangle));
                                resolve();
                            }

                        });
                    } else {
                        this.faces = [];
                        resolve();
                    }
                });
            }

        });
    }
}