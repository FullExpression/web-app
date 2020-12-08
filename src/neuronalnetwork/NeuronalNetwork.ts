// Load the tfjs-node binding
import * as tf from '@tensorflow/tfjs/';
import { mobileNetClasses } from './MobileNetClasses';
import { GraphModel, LayersModel } from '@tensorflow/tfjs/';

export class NeuronalNetwork {
    private MODEL_PATH: string = 'http://localhost:4200/assets/models/tensorflowjs_model.pb';
    private WEIGHTS_PATH: string = 'http://localhost:4200/assets/models/weights_manifest.json';
    private model: GraphModel;
    constructor(){}
    async loadModel() {
        /*const localModel: LayersModel = (await tf.loadLayersModel(this.WEIGHTS_PATH));
        //const localModel: any = (await tf.loadLayersModel('http://localhost:4200/assets/models/face-detection/ssd_mobilenetv1_model-weights_manifest.json'));
        const pred = await tf.tidy(() => {
            let image: any = document.getElementById('cat');
            
            let tensor =  tf.browser.fromPixels(image).resizeNearestNeighbor([224,224]).toFloat().expandDims();
            tensor = tensor.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(127.5));
            debugger;
            let result = localModel.predict(tensor) as any;
            let predictArray = Array.from(result.dataSync());
            let classesName = predictArray.map((p: number, i: number) => {
                return {
                    probability: p,
                    className: mobileNetClasses[i]
                }
            });
            let firstFive = classesName.sort((a,b) => {
                return b.probability - a.probability;
            });

            console.log(firstFive);
            console.log(firstFive)
        });
      */
        
    }
    async predict(){
        let image: any = document.getElementById('cat');
        //this.model.execute({input: tf.browser.fromPixels(image)});
    }
    
}