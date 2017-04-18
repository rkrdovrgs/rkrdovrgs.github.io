import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";

@inject(LessonsService, Router)
export class Lessons {
    lessons: ILesson[];
    addLessonUrl: string;

    constructor(private lessonsService: LessonsService, private router: Router) { }

    activate() {
        this.addLessonUrl = this.router.generate("lesson-details", { key: "add" });
        this.lessonsService.getLessons().then(lessons => this.lessons = lessons);
    }
}

