import { inject } from "aurelia-framework";
import { LessonsService } from "dataservices/lessons";
import { Router } from "aurelia-router";

@inject(LessonsService, Router)
export class Lessons {
    lessons: ILesson[];

    constructor(private lessonsService: LessonsService, private router: Router) { }

    activate() {
        this.lessonsService.getLessons().then(lessons => this.lessons = lessons);
    }
}

