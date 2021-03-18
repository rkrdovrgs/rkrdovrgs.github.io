import { BaseApiService } from "dataservices/base";
import { inject } from "aurelia-dependency-injection";
import { Mapper } from "./mapper";
import { Storage } from "helpers/storage";
import * as firebase from "firebase";
import * as moment from "moment";

@inject(BaseApiService, Mapper, Storage)
export class LessonsService {
    lessonsRef: firebase.database.Reference;

    constructor(private api: BaseApiService, private mapper: Mapper, private storage: Storage) {
        this.lessonsRef = firebase.database().ref("lessons");
    }

    saveLesson(lesson: ILesson): Promise<ILesson> {
        return new Promise(resolve => {
            if (!lesson.key) {
                delete lesson.key;
                let lessonRef = this.lessonsRef.push(lesson);
                lessonRef.then(() => resolve(this.mapper.getLesson(lessonRef.key, lesson)));
            } else {
                this.lessonsRef.child(lesson.key)
                    .update(lesson)
                    .then(() => resolve(lesson));
            }
        });
    }

    saveActivity(lessonKey: string, activity: IActivity): Promise<IActivity> {
        activity.lastUpdated = moment().toISOString();
        return new Promise(resolve => {
            if (!activity.key) {
                delete activity.key;
                let activityRef = this.lessonsRef.child(lessonKey)
                    .child("activities")
                    .push(activity);
                activityRef.then(() => resolve(this.mapper.getActivity(lessonKey, activityRef.key, activity)));
            } else {
                this.lessonsRef.child(lessonKey)
                    .child("activities")
                    .child(activity.key)
                    .update(activity)
                    .then(() => resolve(activity));
            }
        });
    }

    subscribeToActivity(lessonKey: string, activityKey: string) {
        let activityLastUpdatedRef = this.lessonsRef.child(lessonKey)
            .child("activities")
            .child(activityKey)
            .child("lastUpdated");
        return {
            on: resolve => {
                let activityCallback = activityLastUpdatedRef.on("value", resolve);
                return () => {
                    activityLastUpdatedRef.off("value", activityCallback);
                };
            }
        };
    }

    addAnswer(lessonKey: string, activityKey: string): Promise<IAnswer> {
        return new Promise(resolve => {
            let answer = <IAnswer>{
                value: ""
            };
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .push(answer);
            answerRef.then(() => resolve(this.mapper.getAnswer(answerRef.key, answer)));
        });
    }

    async takeAnswer(lessonKey: string, activityKey: string, answerKey: string): Promise<void> {
        const staffSnap = await firebase.database().ref("staff").once("value");
        const staff = Object.values(staffSnap.val());
        if (staff.some((s: string) => this.storage.email.includes(s))) {
            return;
        }

        return await new Promise(resolve => {
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .child(answerKey)
                .child("taken")
                .push(this.storage.getUserInfo());
            answerRef.then(() => resolve());
        });
    }

    getAnswerTaken(lessonKey: string, activityKey: string, answerKey: string) {
        let takenRef = this.lessonsRef
            .child(lessonKey)
            .child("activities")
            .child(activityKey)
            .child("answers")
            .child(answerKey)
            .child("taken");
        return {
            on: (callback) => {
                let takenCallback = takenRef.on("value", snap => callback(snap.val()));
                return () => {
                    takenRef.off("value", takenCallback);
                };
            }
        };
    }

    blink(lessonKey: string, activityKey: string, tries: { [answerKey: string]: number }): Promise<undefined> {
        return new Promise(resolve => {
            let answerRef = this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("blinks")
                .child(btoa(this.storage.email))
                .update({ user: this.storage.getUserInfo(), tries });
            answerRef.then(() => resolve(undefined));
        });
    }

    removeAnswer(lessonKey: string, activityKey: string, answerKey: string): Promise<undefined> {
        return new Promise(resolve => {
            this.lessonsRef.child(lessonKey)
                .child("activities")
                .child(activityKey)
                .child("answers")
                .child(answerKey)
                .remove(resolve);
        });
    }

    getLesson(lessonKey: string) {
        let lessonRef = this.lessonsRef.child(lessonKey);
        return {
            on: (resolve: (lesson: ILesson) => void) => {
                let lessonCallback = lessonRef.on("value", this.getLessonCallback(lessonKey, resolve).bind(this));
                return () => {
                    lessonRef.off("value", lessonCallback);
                };
            },
            once: (resolve: (lesson: ILesson) => void) => {
                lessonRef.once("value", this.getLessonCallback(lessonKey, resolve).bind(this));
            }
        };
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

    getAsignees(lessonKey: string, activityKey: string, answerKey: string, callback) {
        return this.lessonsRef
            .child(lessonKey)
            .child("activities")
            .child(activityKey)
            .child("answers")
            .child(answerKey)
            .child("taken")
            .on("value", callback);
    }
}