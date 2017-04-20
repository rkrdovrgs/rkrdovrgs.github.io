import { Router } from "aurelia-router";
import { inject } from "aurelia-dependency-injection";


@inject(Router)
export class Mapper {

    constructor(private router: Router) { }

    getLesson(lessonKey: string, lessons: { [lessonKey: string]: ILesson } | ILesson): ILesson {
        let lesson: ILesson = lessons[lessonKey] || lessons;
        lesson.key = lessonKey;
        lesson.url = this.router.generate("lesson-details", { key: lessonKey });
        for (var activityKey in lesson.activities) {
            this.getActivity(lessonKey, activityKey, lesson.activities);
        }
        return lesson;
    }

    getActivity(lessonKey: string, activityKey: string, activities: { [activityKey: string]: IActivity } | IActivity): IActivity {
        let activity: IActivity = activities[activityKey] || activities;
        activity.key = activityKey;
        activity.url = this.router.generate("lesson-activity-details", { lessonKey, activityKey });
        activity.view = this.router.generate("activity-viewer", { lessonKey, activityKey });
        for (var answerKey in activity.answers) {
            this.getAnswer(answerKey, activity.answers);
        }
        return activity;
    }

    getAnswer(answerKey: string, answers: { [answerKey: string]: IAnswer } | IAnswer): IAnswer {
        let answer: IAnswer = answers[answerKey] || answers;
        answer.key = answerKey;

        return answer;
    }
}