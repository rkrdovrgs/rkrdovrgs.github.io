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


    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.lessonService.getLessonOnce(params.lessonKey, lesson => {
            this.lesson = lesson;
            this.activity = lesson.activities[params.activityKey];
            if (this.activity.showAllAnswers) {
                var randomSort = this.getUniqueRandom(Object.keys(this.activity.answers).length);
                this.answers = randomSort.map(r => {
                    var answerKey = Object.keys(this.activity.answers)[r];
                    return this.activity.answers[answerKey];
                });
            } else {
                this.showOneAnswer(params.lessonKey, params.activityKey);
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
            if (randomNumber === uniqueArr.length) continue;
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

