import { CnnClassification } from "@fullexpression/emotionclassification";

export interface TestClassification {
    label: string,
    cnnClassification: CnnClassification
}