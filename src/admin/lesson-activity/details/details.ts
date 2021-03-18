import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as _ from "lodash";

@inject(LessonsService, Router)
export class LessonActivityDetails {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    answersTakenUrl: string;
    lastUpdated: string;

    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {

        this.lessonService.getLesson(params.lessonKey).once(lesson => {
            this.lesson = lesson;
            if (!!params.activityKey) {
                this.answersTakenUrl = this.router.generate("lesson-activity-answers-taken", params);
                this.activity = lesson.activities[params.activityKey];
                if (!!this.activity && !!this.activity.answers) {
                    this.answers = Object.keys(this.activity.answers)
                        .map(answerKey => this.activity.answers[answerKey]);
                }
            }
        });
    }

    addAnswer(answerIndex?: number) {
        this.lessonService.addAnswer(this.lesson.key, this.activity.key)
            .then(answer => {
                this.activity.answers = this.activity.answers || {};
                this.activity.answers[answer.key] = answer;
                if (answerIndex >= 0) {
                    this.answers.splice(answerIndex + 1, 0, this.activity.answers[answer.key]);
                } else {
                    this.answers.unshift(this.activity.answers[answer.key]);
                }
            });
    }

    removeAnswer(answerKey: string, answerIndex: number) {
        this.lessonService.removeAnswer(this.lesson.key, this.activity.key, answerKey)
            .then(() => {
                this.answers.splice(answerIndex, 1);
                delete this.activity.answers[answerKey];
            });
    }

    saveActivity() {
        this.activity.type = this.activity.type || "one-answer";
        this.activity.speedRatio = this.activity.speedRatio || 250;
        this.activity.tries = this.activity.tries || 3;
        this.activity.hideComments = this.activity.hideComments || false;
        this.activity.hideCode = this.activity.hideCode || false;
        this.activity.disable = this.activity.disable || false;
        this.activity.lang = this.activity.lang || "javascript";
        this.activity.ssViewerUrl = this.activity.ssViewerUrl || "";
        this.activity.choices = this.activity.choices || 3;
        _.sortBy(this.answers, a => a.key).forEach((answer, answerIndex) => {
            this.activity.answers[answer.key] = this.answers[answerIndex];
        });

        return this.lessonService.saveActivity(this.lesson.key, this.activity)
            .then(activity => {
                this.lastUpdated = `Last updated at ${activity.lastUpdated}`;
                this.activity.key = activity.key;
                this.router.navigateToRoute("lesson-activity-details", { lessonKey: this.lesson.key, activityKey: activity.key });
            });
    }
}
