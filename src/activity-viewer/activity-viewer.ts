import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as _ from "lodash";
import * as $ from "jquery";
import environment from "environment";

@inject(LessonsService, Router)
export class ActivityViewer {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    storage = environment.debug ? sessionStorage : localStorage;
    tries: number = 0;
    currentAnswerIndex: number = 0;


    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.lessonService.getLessonOnce(params.lessonKey, lesson => {
            this.lesson = lesson;
            this.activity = lesson.activities[params.activityKey];
            switch (this.activity.type) {
                case "one-answer":
                    this.showOneAnswer(params.lessonKey, params.activityKey);
                    break;
                case "all-answers":
                    var randomSort = this.getUniqueRandom(Object.keys(this.activity.answers).length);
                    this.answers = randomSort.map(r => {
                        var answerKey = Object.keys(this.activity.answers)[r];
                        return this.activity.answers[answerKey];
                    });
                case "blink":
                    let triesKey = `answer-tries${params.lessonKey}${params.activityKey}`;
                    this.tries = parseInt(this.storage.getItem(triesKey)) || 0;
                    this.tries++;
                    this.storage.setItem(triesKey, this.tries.toString());

                    break;
            }
            this.highlight();
        });
    }

    highlight() {
        setTimeout(() => {
            $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        }, 100);
    }

    blinkAnswer() {
        if (this.currentAnswerIndex === Object.keys(this.activity.answers).length) {
            this.answers = [<IAnswer>{ html: '<pre><code>//No more hints</code></pre>' }];
        } else {
            let answerKey = Object.keys(this.activity.answers)[this.currentAnswerIndex];
            this.answers = [this.activity.answers[answerKey]];
            this.highlight();
            this.currentAnswerIndex++;
            setTimeout(() => {
                this.answers = [];
            }, (this.activity.answers[answerKey].html.length * this.activity.speedRatio) + 100);
        }
    }

    showOneAnswer(lessonKey: string, activityKey: string) {
        let key = `answer${lessonKey}${activityKey}`;
        let guid = this.storage.getItem("guid");
        if (!guid) {
            guid = this.guid();
            this.storage.setItem("guid", guid);
        }

        let answerKey = this.storage.getItem(key);
        if (!answerKey) {
            let minSelected = _.min(_.map(this.activity.answers, (ans: IAnswer, key) => {
                return Object.keys(ans.taken || {}).length;
            }));
            let answers = _(this.activity.answers).map(answer => answer).filter(answer => Object.keys(answer.taken || {}).length === minSelected).value();
            let choice = this.getRandom(0, answers.length);
            let answer = answers[choice];
            this.answers = [answer];
            this.storage.setItem(key, answer.key);
            this.lessonService.takeAnswer(lessonKey, activityKey, answer.key, guid);
        } else {
            let answer = this.activity.answers[answerKey];
            this.answers = [answer];
        }
    }

    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getUniqueRandom(length: number) {
        var uniqueArr = []
        while (uniqueArr.length < length) {
            var randomNumber = this.getRandom(0, length);
            if (uniqueArr.length !== length - 1 && randomNumber === uniqueArr.length) continue;
            if (uniqueArr.indexOf(randomNumber) > -1) continue;
            uniqueArr[uniqueArr.length] = randomNumber;
        }

        return uniqueArr;
    }

    guid() {
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
}

