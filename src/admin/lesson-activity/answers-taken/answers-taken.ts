import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as _ from "lodash";

@inject(LessonsService, Router)
export class AnswersTaken {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    activityUrl: string;
    listeners: IDetachListener[] = [];
    taken: { [answerKey: string]: IUserInfo[] } = {};

    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.activityUrl = this.router.generate("lesson-activity-details", params);
        this.lessonService.getLesson(params.lessonKey).once(lesson => {
            this.lesson = lesson;
            this.activity = lesson.activities[params.activityKey];
            if (!!this.activity.answers) {
                this.answers = Object.keys(this.activity.answers)
                    .map(answerKey => {
                        this.lessonService.getAnswerTaken(this.lesson.key, this.activity.key, answerKey)
                            .on((taken: { [key: string]: IUserInfo }) => {
                                this.taken[answerKey] = _(taken)
                                    .filter((userInfo: IUserInfo) => !!userInfo.displayName)
                                    .map(userInfo => userInfo)
                                    .value();
                            });
                        return this.activity.answers[answerKey];
                    });
            }
        });
    }

    deactivate() {
        this.listeners.forEach(dettach => {
            dettach();
        });
    }
}

