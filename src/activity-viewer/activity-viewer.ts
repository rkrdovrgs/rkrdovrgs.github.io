import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as _ from "lodash";
import { Storage } from "helpers/storage";

@inject(LessonsService, Router, Storage)
export class ActivityViewer {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    currentAnswerIndex: number = 0;
    currentAnswerKey: string = "";
    tries: { [answerKey: string]: number };


    constructor(private lessonService: LessonsService, private router: Router, private storage: Storage) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.lessonService.getLesson(params.lessonKey).once(lesson => {
            this.lesson = lesson;
            this.activity = lesson.activities[params.activityKey];
            switch (this.activity.type) {
                case "one-answer":
                    this.showOneAnswer();
                    break;
                case "all-answers":
                    var randomSort = this.getUniqueRandom(Object.keys(this.activity.answers).length);
                    this.answers = randomSort.map(r => {
                        var answerKey = Object.keys(this.activity.answers)[r];
                        return this.activity.answers[answerKey];
                    });
                case "blink":
                    this.tries = this.activity.blinks[btoa(this.storage.email)].tries;
                    this.nextAnswer(0);
                    break;
            }
        });
    }

    blinkAnswer() {
        this.tries[this.currentAnswerKey]++;
        this.lessonService.blink(this.lesson.key, this.activity.key, this.tries);
        this.answers = [this.activity.answers[this.currentAnswerKey]];

        setTimeout(() => {
            this.answers = [];
        }, (this.activity.answers[this.currentAnswerKey].value.length * this.activity.speedRatio) + 100);
    }

    nextAnswer(step: number) {
        let answerKeys = Object.keys(this.activity.answers);
        this.currentAnswerIndex += step;

        if (this.currentAnswerIndex < 0) this.currentAnswerIndex = 0;
        if (this.currentAnswerIndex >= answerKeys.length)
            this.currentAnswerIndex = answerKeys.length - 1;

        this.currentAnswerKey = answerKeys[this.currentAnswerIndex];
        this.tries[this.currentAnswerKey] = this.tries[this.currentAnswerKey] || 0;
    }

    showOneAnswer() {
        let answer = _(this.activity.answers)
            .filter((answer: IAnswer) =>
                _.some(answer.taken, (user: IUserInfo) => user.email === this.storage.email)
            )
            .map((answer: IAnswer) => answer)
            .value();

        if (!answer.length) {
            let minSelected = _.min(_.map(this.activity.answers, (ans: IAnswer, key) => {
                return Object.keys(ans.taken || {}).length;
            }));

            let answers = _(this.activity.answers)
                .map(answer => answer)
                .filter(answer => Object.keys(answer.taken || {}).length === minSelected)
                .value();

            let choice = this.getRandom(0, answers.length);
            let answer = answers[choice];
            this.answers = [answer];
            this.lessonService.takeAnswer(this.lesson.key, this.activity.key, answer.key);
        } else {
            this.answers = [answer[0]];
        }
    }

    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getUniqueRandom(length: number) {
        var uniqueArr = [];
        while (uniqueArr.length < length) {
            var randomNumber = this.getRandom(0, length);
            if (uniqueArr.length !== length - 1 && randomNumber === uniqueArr.length) continue;
            if (uniqueArr.indexOf(randomNumber) > -1) continue;
            uniqueArr[uniqueArr.length] = randomNumber;
        }

        return uniqueArr;
    }
}

