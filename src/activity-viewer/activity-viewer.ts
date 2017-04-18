import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as _ from "lodash";
import * as $ from "jquery";

@inject(LessonsService, Router)
export class ActivityViewer {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    detachLesson: IDetachListener;
    storage = localStorage;
    timeoutId: NodeJS.Timer;


    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        let key = `answer${params.lessonKey}${params.activityKey}`;
        let guid = this.storage.getItem("guid");
        if (!guid) {
            guid = this.guid();
            this.storage.setItem("guid", guid);
        }

        this.detachLesson = this.lessonService.getLesson(params.lessonKey, lesson => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => {
                console.log("Getting answers", new Date());

                this.lesson = lesson;
                this.activity = lesson.activities[params.activityKey];
                let answerKey = this.storage.getItem(key);

                if (!answerKey) {
                    let minSelected = _.min(_.map(this.activity.answers, (ans: IAnswer, key) => {
                        return Object.keys(ans.taken || {}).length;
                    }));
                    let answers = _(this.activity.answers).map(answer => answer).filter(answer => Object.keys(answer.taken || {}).length === minSelected).value();
                    let choice = this.getRandom(0, answers.length - 1);
                    let answer = answers[choice];
                    this.answers = [answer];
                    this.storage.setItem(key, answer.key);
                    this.lessonService.takeAnswer(params.lessonKey, params.activityKey, answer.key, guid);
                } else {
                    let answer = this.activity.answers[answerKey];
                    this.answers = [answer];
                }

                setTimeout(() => {
                    $('pre code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }, 100);
            }, this.getRandom(250, 1000));
        });
    }

    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    guid() {
        let s4 = () => Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    deactivate() {
        this.detachLesson();
    }

}

