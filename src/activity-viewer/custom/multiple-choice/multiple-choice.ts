import { CustomViewer } from "../custom-viewer";
import { Storage } from "helpers/storage";
import { inject } from "aurelia-framework";

@inject(Storage)
export class CodeAlong extends CustomViewer {
    answers: IAnswer[] = [];
    currentAnswerIndex: number = 0;
    currentAnswerKey: string;
    choices: number;

    constructor(private storage: Storage) {
        super();
    }

    attached() {
        this.choices = this.model.activity.choices || 3;
        this.choices = this.choices < 3 ? 3 : this.choices;
        this.nextAnswer(0);
    }

    nextAnswer(step: number) {
        let answerKeys = Object.keys(this.model.activity.answers);
        this.currentAnswerIndex += step;

        if (this.currentAnswerIndex < 0) this.currentAnswerIndex = 0;
        if (this.currentAnswerIndex >= answerKeys.length)
            this.currentAnswerIndex = answerKeys.length - 1;

        this.currentAnswerKey = answerKeys[this.currentAnswerIndex];

        let randomSort = this.model.getUniqueRandom(answerKeys.length - this.currentAnswerIndex)
            .map(r => r + this.currentAnswerIndex);
        randomSort.splice(randomSort.indexOf(this.currentAnswerIndex), 1);
        randomSort = randomSort.slice(0, this.choices - 1);
        let randomPos = this.model.getRandom(0, randomSort.length + 1);
        randomSort.splice(randomPos, 0, this.currentAnswerIndex);
        this.answers = randomSort.map(r => {
            var answerKey = answerKeys[r];
            return this.model.activity.answers[answerKey];
        });
    }
}