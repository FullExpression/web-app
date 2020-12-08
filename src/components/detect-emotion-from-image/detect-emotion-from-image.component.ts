import { Component, OnInit, ChangeDetectorRef, HostListener } from "@angular/core";
import { CNNService } from "@fullexpression/emotion-classification";
import { EmotionImage } from "@fullexpression/emotion-classification";
import { ContextMenuLine } from '../menu/context-button/context-menu-line.model';
import { ChartModel, Folder, ExcelService, Excel } from '@fullexpression/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FilesService } from '@fullexpression/core';
@Component({
    selector: 'detect-emotion-from-image-component',
    templateUrl: './detect-emotion-from-image.component.html',
    styleUrls: ['./detect-emotion-from-image.component.scss'],
    animations: [
        trigger('showRadar', [
            state('true', style({
                opacity: 1,
                "margin-top": "30px"
            })),
            state('false', style({
                opacity: 0,
                "margin-top": "100px"
            })),
            transition('true => false', animate('600ms 100ms cubic-bezier(.17,.67,.51,.94)')),
            transition('false => true', animate('600ms 100ms cubic-bezier(.17,.67,.51,.94)'))
        ]),
        trigger('showLinear', [
            state('true', style({
                opacity: 1,
                "margin-top": "30px"
            })),
            state('false', style({
                opacity: 0,
                "margin-top": "100px"
            })),
            transition('true => false', animate('600ms 300ms cubic-bezier(.17,.67,.51,.94)')),
            transition('false => true', animate('600ms 300ms cubic-bezier(.17,.67,.51,.94)'))
        ]),
        trigger('showSearch', [
            state('true', style({
                opacity: 1,
                "margin-top": "0px"
            })),
            state('false', style({
                opacity: 0,
                "margin-top": "100px"
            })),
            transition('true => false', animate('600ms 500ms cubic-bezier(.17,.67,.51,.94)')),
            transition('false => true', animate('600ms 500ms cubic-bezier(.17,.67,.51,.94)'))
        ]),
        trigger('hasImages', [
            state('true', style({
                opacity: 1,
                "margin-top": "0px"
            })),
            state('false', style({
                opacity: 0,
                "margin-top": "100px"
            })),
            transition('true => false', animate('600ms 700ms cubic-bezier(.17,.67,.51,.94)')),
            transition('false => true', animate('600ms 700ms cubic-bezier(.17,.67,.51,.94)'))
        ])
    ]
})
export class DetectEmotionFromImageComponent implements OnInit {
    isLoading = true;
    originalEmotionImages = new Array<EmotionImage>();
    emotionImages = new Array<EmotionImage>();
    hasImages = false;
    contextMenuLines = new Array<ContextMenuLine>();
    loadingMessage = "Loading . . .";
    radarChartModelConfig: ChartModel = new ChartModel();
    lineChartModelConfig: ChartModel = new ChartModel();
    showRadar = false;
    showLinear = false;
    showSearch = false;
    private graphicsWidth = "36vw";
    private graphicsHeight = "35vh";
    constructor(private cnnService: CNNService,
        private changeDetectorRef: ChangeDetectorRef,
        private filesService: FilesService,
        private excelService: ExcelService) { }
    ngOnInit(): void {
        this.cnnService.loadModel().subscribe(() => {
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
        });
        this.showRadar = false;
        this.showLinear = false;
        this.showSearch = false;
        this.hasImages = false;
        this.setCharts();

    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        let setCharts = false;
        if (window.innerWidth < 1000) {
            this.graphicsWidth = "60vw";
            this.graphicsHeight = "40vh";
        } else {
            this.graphicsWidth = "36vw";
            this.graphicsHeight = "35vh";
        }
        this.setCharts();
    }

    getReportComponentVisibleState() {
        return this.isLoading || (!this.isLoading && !this.hasImages);
    }

    search(event: any) {
        const searchQuery = (<HTMLInputElement>event.target).value
        this.emotionImages = this.originalEmotionImages.filter(image => {
            return (image && image.classification && image.classification.classificationLabel
                && image.classification.classificationLabel.toLocaleLowerCase().includes(searchQuery.toLowerCase())) ||
                (image && image.name && image.name.toLowerCase().includes(searchQuery.toLowerCase()));

        })
    }

    importedImages(images: Array<{ name: string, url: string }>): void {
        let localEmotionImages = new Array<EmotionImage>();
        this.isLoading = true;
        this.loadingMessage = "Start the image classification..."
        if (images.length > 0) {
            let numberOfLoadedImages = 0;
            images.forEach((image) => {
                this.cnnService.predict(image.url).subscribe((classification) => {
                    localEmotionImages.push(
                        new EmotionImage(image.name, image.url, classification)
                    )
                    numberOfLoadedImages++
                    this.loadingMessage = `Start the image classification (${numberOfLoadedImages} of ${images.length}) ...`;
                    if (numberOfLoadedImages === images.length) {
                        this.showImages(localEmotionImages);
                    }
                });
            });
        } else {
            this.showImages(localEmotionImages);
        }

    }

    private changeContextMenuLines() {
        if (this.getReportComponentVisibleState()) {
            this.contextMenuLines = [];
        } else {
            this.contextMenuLines = [{
                description: "Import new images",
                callback: () => this.importNewImages()
            },
            {
                description: "Download report",
                callback: () => this.downloadReport()
            }, {
                description: "Download images by emotion",
                callback: () => this.downloadImages()
            }];
        }
    }

    private importNewImages(): void {
        this.hasImages = false;
        this.emotionImages = new Array<EmotionImage>();
        this.originalEmotionImages = this.emotionImages;
        this.changeDetectorRef.detectChanges();
        this.changeContextMenuLines();
    }


    private showImages(emotionImages: Array<EmotionImage>) {
        this.emotionImages = emotionImages;
        this.originalEmotionImages = this.emotionImages;
        setTimeout(() => {
            this.setCharts();
        }, 600);

        this.showRadar = true;
        this.showLinear = true;
        this.showSearch = true;
        this.hasImages = true;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();

        this.changeContextMenuLines();
    }

    private downloadImages() {

        let folder = new Folder("Images", new Array<Folder>(
            new Folder('Afraid', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Angry', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Disgusted', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Happy', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Neutral', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Sad', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),
            new Folder('Suprised', undefined, this.getEmotionsImagesUrl('afraid'), this.getEmotionsImageName('afraid')),

        ));
        this.filesService.downloadAsZip(folder);
    }

    private getEmotionsImagesUrl(emotionLabel: string): Array<string> {
        return this.originalEmotionImages
            .filter(emotion => emotion.classification.classificationLabel.toLocaleLowerCase() === emotionLabel.toLocaleLowerCase())
            .map(emotion => emotion.imageUrl);
    }

    private getEmotionsImageName(emotionLabel: string): Array<string> {
        return this.originalEmotionImages
            .filter(emotion => emotion.classification.classificationLabel.toLocaleLowerCase() === emotionLabel.toLocaleLowerCase())
            .map(emotion => emotion.name);
    }

    private downloadReport() {
        let excel = new Excel();
        let total = this.getTotalImagesPerEmotion();
        excel.table = [];
        excel.table.push(["Image Name", "Emotion Classification", "Afraid Confidence", "Angry Confidence",
            "Disgusted Confidence", "Happy Confidence", "Neutral Confidence", "Sad Confidence", "Suprised Confidence"])
        this.originalEmotionImages.forEach((emotion) => {
            excel.table.push([emotion.name, emotion.classification.classificationLabel,
            emotion.classification.confidence.Afraid, emotion.classification.confidence.Angry,
            emotion.classification.confidence.Disgusted, emotion.classification.confidence.Happy,
            emotion.classification.confidence.Neutral, emotion.classification.confidence.Sad, emotion.classification.confidence.Suprised]);
        })
        excel.table.push([]);
        excel.table.push([]);
        excel.table.push(["Total Afraid Images:", total[0]]);
        excel.table.push(["Total Angry Images:", total[1]]);
        excel.table.push(["Total Disgusted Images:", total[2]]);
        excel.table.push(["Total Happy Images:", total[3]]);
        excel.table.push(["Total Neutral Images:", total[4]]);
        excel.table.push(["Total Sad Images:", total[5]]);
        excel.table.push(["Total Suprised Images:", total[6]]);

        this.excelService.save(excel);
    }


    private getTotalImagesPerEmotion(): Array<number> {
        let data = [0, 0, 0, 0, 0, 0, 0];
        this.originalEmotionImages.forEach((emotion) => {
            switch (emotion.classification.classificationLabel.toLocaleLowerCase()) {
                case "afraid": data[0]++; break;
                case "angry": data[1]++; break;
                case "disgusted": data[2]++; break;
                case "happy": data[3]++; break;
                case "neutral": data[4]++; break;
                case "sad": data[5]++; break;
                case "suprised": data[6]++; break;
            }
        });
        return data;
    }

    private setCharts() {
        let data = this.getTotalImagesPerEmotion();
        this.setChartPie(data);
        this.setChartRadar(data);
    }

    private setChartPie(data: Array<number>) {
        this.lineChartModelConfig = {
            labels: ["Afraid", "Angry", "Disgusted", "Happy", "Neutral", "Sad", "Suprised"],
            data: [{
                data: data,
                label: ''
            }],
            options: {
                maintainAspectRatio: false,
                animation: {
                    duration: 1000
                },
                responsive: true,
                legend: {
                    display: true
                }
            },
            width: this.graphicsWidth,
            height: this.graphicsHeight
        }
    }

    private setChartRadar(data: Array<number>) {
        this.radarChartModelConfig = {
            data: [
                {
                    data: data,
                    label: ''
                },
            ],
            labels: ['Afraid', 'Angry', 'Disgusted', 'Happy', 'Neutral', 'Sad', 'Suprised'],
            options: {
                scaleFontSize: 20,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000
                },
                responsive: true,
                legend: {
                    display: false
                },
                scale: {
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.5)'
                    },
                    angleLines: {
                        color: 'black' // lines radiating from the center
                    },
                    pointLabels: {
                        fontColor: 'black' // labels around the edge like 'Running'
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'black', // labels such as 10, 20, etc
                        showLabelBackdrop: false // hide square behind text
                    },
                }
            },
            width: this.graphicsWidth,
            height: this.graphicsHeight
        }
    }
}