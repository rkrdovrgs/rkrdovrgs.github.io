import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";
import * as $ from "jquery";

@inject(LessonsService, Router)
export class LessonActivityDetails {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];
    detachLesson: IDetachListener;


    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.detachLesson = this.lessonService.getLesson(params.lessonKey, lesson => {
            this.lesson = lesson;
            if (!!params.activityKey) {
                this.activity = lesson.activities[params.activityKey];
                if (!!this.activity && !!this.activity.answers) {
                    this.answers = Object.keys(this.activity.answers).map(answerKey => this.activity.answers[answerKey]);
                    setTimeout(() => {
                        $('pre code').each(function (i, block) {
                            hljs.highlightBlock(block);
                        });
                    }, 100);
                }
            }
        });
    }

    deactivate() {
        this.detachLesson();
    }

    addAnswer() {
        this.lessonService.addAnswer(this.lesson.key, this.activity.key);
    }

    removeAnswer(answerKey: string) {
        this.lessonService.removeAnswer(this.lesson.key, this.activity.key, answerKey);
    }

    saveActivity() {
        this.activity.type = this.activity.type || "one-answer";
        this.activity.speedRatio = this.activity.speedRatio || 25;
        this.activity.tries = this.activity.tries || 3;
        this.activity.hideComments = this.activity.hideComments || false;
        this.activity.hideCode = this.activity.hideCode || false;
        this.answers.forEach(answer => {
            this.activity.answers[answer.key] = answer;
        });
        this.lessonService.saveActivity(this.lesson.key, this.activity)
            .then(activity => {
                this.router.navigateToRoute("lesson-activity-details", { lessonKey: this.lesson.key, activityKey: activity.key })
            });
    }

}

