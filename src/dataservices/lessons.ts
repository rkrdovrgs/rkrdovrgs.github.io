import { BaseApiService } from "dataservices/base";
import { inject } from "aurelia-dependency-injection";
import { Mapper } from "./mapper";

import * as firebase from "firebase";

@inject(BaseApiService, Mapper)
export class LessonsService {
    lessonsRef: firebase.database.Reference;

    constructor(private api: BaseApiService, private mapper: Mapper) {
        this.lessonsRef = firebase.database().ref("lessons");
    }

    saveLesson(lesson: ILesson): Promise<ILesson> {
        return new Promise(resolve => {
            if (!lesson.key) {
                delete lesson.key;
                let lessonRef = this.lessonsRef.push(lesson);
                lessonRef.then(() => resolve(this.mapper.getLesson(lessonRef.key, lesson)));
            }
            else {
                this.lessonsRef.child(lesson.key)
                    .update(lesson)
                    .then(() => resolve(lesson));
            }
        });
    }

    saveActivity(lessonKey: string, activity: IActivity): Promise<IActivity> {
        return new Promise(resolve => {
            if (!activity.key) {
                delete activity.key;
                let activityRef = this.lessonsRef.child(lessonKey)
                    .child("activities")
                    .push(activity);
                activityRef.then(() => resolve(this.mapper.getActivity(lessonKey, activityRef.key, activity)));
            }
            else {
                this.lessonsRef.child(lessonKey)
                    .child("activities")
                    .child(activity.key)
                    .update(activity)
                    .then(() => resolve(activity));
            }
        });
    }

    addAnswer(lessonKey: string, activityKey: string): Promise<IAnswer> {
        return new Promise(resolve => {
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .push({ value: "" });
            answerRef.then(() => resolve(this.mapper.getAnswer(answerRef.key, {})));
        });
    }

    takeAnswer(lessonKey: string, activityKey: string, answerKey: string, guid: string): Promise<undefined> {
        return new Promise(resolve => {
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .child(answerKey)
                .child("taken")
                .update({ [guid]: firebase.database.ServerValue.TIMESTAMP });
            answerRef.then(() => resolve(undefined));
        });
    }

    removeAnswer(lessonKey: string, activityKey: string, answerKey: string): Promise<undefined> {
        return new Promise(resolve => {
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .child(answerKey)
                .remove();
            answerRef.then(() => resolve());
        });
    }

    getLesson(lessonKey: string, resolve: (lesson: ILesson) => void) {
        let lessonCallback = this.lessonsRef.child(lessonKey)
            .on("value", this.getLessonCallback(lessonKey, resolve).bind(this));

        return () => {
            this.lessonsRef.off("value", lessonCallback);
        }
    }

    getLessonOnce(lessonKey: string, resolve: (lesson: ILesson) => void) {
        this.lessonsRef.child(lessonKey)
            .once("value", this.getLessonCallback(lessonKey, resolve).bind(this));
    }

    getLessonCallback(lessonKey, resolve) {
        return snap => resolve(this.mapper.getLesson(lessonKey, snap.val()));
    }

    getLessonsOnce(): Promise<ILesson[]> {
        return new Promise(resolve => {
            this.lessonsRef.once("value", snap => {
                let lessons = Object.keys(snap.val()).map(lessonKey => this.mapper.getLesson(lessonKey, snap.val()));
                resolve(lessons);
            });
        });
    }


}