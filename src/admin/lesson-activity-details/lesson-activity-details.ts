import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";

@inject(LessonsService, Router)
export class LessonActivityDetails {
    lesson: ILesson;
    activity: IActivity;
    answers: IAnswer[] = [];

    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { lessonKey: string, activityKey: string }) {
        this.lessonService.getLessonOnce(params.lessonKey, lesson => {
            this.lesson = lesson;
            if (!!params.activityKey) {
                this.activity = lesson.activities[params.activityKey];
                if (!!this.activity && !!this.activity.answers) {
                    this.answers = Object.keys(this.activity.answers).map(answerKey => this.activity.answers[answerKey]);
                }
            }
        });
    }

    addAnswer() {
        this.lessonService.addAnswer(this.lesson.key, this.activity.key)
            .then(answer => this.answers.push(answer));
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
        this.activity.speedRatio = this.activity.speedRatio || 25;
        this.activity.tries = this.activity.tries || 3;
        this.activity.hideComments = this.activity.hideComments || false;
        this.activity.hideCode = this.activity.hideCode || false;
        this.answers.forEach(answer => {
            this.activity.answers[answer.key] = answer;
        });

        return this.lessonService.saveActivity(this.lesson.key, this.activity)
            .then(activity =>
                this.router.navigateToRoute("lesson-activity-details", { lessonKey: this.lesson.key, activityKey: activity.key })
            );
    }

}

