import { CustomViewer } from "../custom-viewer";
import { Storage } from "helpers/storage";
import { inject } from "aurelia-framework";
import * as _ from "lodash";

@inject(Storage)
export class CodeAlong extends CustomViewer {
    codedAnswer: string;
    existingAnswers: string[];
    currentQuestion: IAnswer;
    isAdmin: boolean;
    uid: string;

    constructor(private storage: Storage) {
        super();
    }

    get codeAlongAnswersRef() {
        return firebase.database().ref("custom-code-along-answers").child(this.model.activity.key);
    }

    get codeAlongCurrentAnswerRef() {
        return this.codeAlongAnswersRef.child(this.currentQuestion.key);
    }

    attached() {
        this.isAdmin = this.storage.isAdmin;
        this.uid = firebase.auth().currentUser.uid;

        let answerKeys = Object.keys(this.model.activity.answers);
        this.codeAlongAnswersRef.child("currentAnswerIndex").on("value", currentAnswerIndexSnap => {
            if (this.currentQuestion) this.codeAlongCurrentAnswerRef.off("value");

            this.codedAnswer = "";
            this.existingAnswers = [];

            this.model.currentAnswerIndex = currentAnswerIndexSnap.val() || 0;
            this.model.currentAnswerKey = answerKeys[this.model.currentAnswerIndex];
            this.currentQuestion = this.model.activity.answers[this.model.currentAnswerKey];

            this.codeAlongCurrentAnswerRef.child(this.uid).once("value", codedAnswerSnap => {
                if (!codedAnswerSnap.val()) return;
                this.codedAnswer = codedAnswerSnap.val().answer;
            });

            this.codeAlongCurrentAnswerRef.on("value", existingAnswerSnap => {
                if (!existingAnswerSnap.val()) return;
                this.existingAnswers = _(Object.values(existingAnswerSnap.val()) as [{ author: string, answer: string }])
                    .orderBy(b => b.author.includes("vrgs") ? 0 : 1)
                    .map(v => v.answer)
                    .value();
            });
        });

        /*
        CodeMirror.fromTextArea(this.codeAreaRef, { lineNumbers: true }).on("change", (e) => {
            debugger;
        });
        */
    }

    updateAnswer() {
        this.codeAlongCurrentAnswerRef.update({
            [this.uid]: {
                answer: this.codedAnswer,
                author: this.storage.email
            }
        });
    }

    nextQuestion(step: number) {
        let answerKeys = Object.keys(this.model.activity.answers);
        const currentAnswerIndex = this.model.currentAnswerIndex + step;

        if (currentAnswerIndex < 0 || currentAnswerIndex >= answerKeys.length) return;

        this.codeAlongAnswersRef.update({ currentAnswerIndex });
    }
}