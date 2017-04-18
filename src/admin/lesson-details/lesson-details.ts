import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";

@inject(LessonsService, Router)
export class LessonDetails {
    lesson: ILesson;
    activities: IActivity[];
    detachLesson: IDetachListener;
    lessonsUrl: string;
    addActivityUrl: string;

    constructor(private lessonService: LessonsService, private router: Router) { }

    activate(params: { key: string }) {
        this.lessonsUrl = this.router.generate("lessons");
        if (!!params.key) {
            this.addActivityUrl = this.router.generate("lesson-activity-details", { lessonKey: params.key, activityKey: "add" });
            this.detachLesson = this.lessonService.getLesson(params.key, lesson => {
                this.lesson = lesson;
                if (!!lesson.activities) {
                    this.activities = Object.keys(lesson.activities).map(activityKey => lesson.activities[activityKey]);
                }
            });
        }
    }

    deactivate() {
        if (!!this.detachLesson) {
            this.detachLesson();
        }
    }

    saveLesson() {
        this.lessonService.saveLesson(this.lesson)
            .then(lesson => {
                this.router.navigateToRoute("lesson-details", { key: lesson.key })
            });
    }

}

