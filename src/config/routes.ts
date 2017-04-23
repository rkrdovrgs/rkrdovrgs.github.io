import Constants from "config/constants";

export default [
    {
        name: "activity-viewer",
        route: ["lessons/:lessonKey/activities/:activityKey/answers"],
        moduleId: "activity-viewer/activity-viewer",
        title: "Activity Answers"
    },
    {
        name: "lesson-activity-answers-taken",
        route: ["admin/lessons/:lessonKey/activities/:activityKey/answers-taken"],
        moduleId: "admin/lesson-activity/answers-taken/answers-taken",
        title: "Activity Details",
        admin: true
    },
    {
        name: "lesson-activity-details",
        route: ["admin/lessons/:lessonKey/activities/add", "admin/lessons/:lessonKey/activities/:activityKey"],
        moduleId: "admin/lesson-activity/details/details",
        title: "Activity Details",
        admin: true
    },
    {
        name: "lesson-details",
        route: ["admin/lessons/add", "admin/lessons/:key"],
        moduleId: "admin/lesson-details/lesson-details",
        title: "Lesson Details",
        admin: true
    },
    {
        name: "lessons",
        route: ["admin/lessons"],
        moduleId: "admin/lessons/lessons",
        title: "Lessons",
        admin: true
    },
    // Account routes
    {
        route: Constants.LOGIN_ROUTE_URL,
        moduleId: "account/login/login",
        title: "Login",
        auth: false,
        name: Constants.LOGIN_ROUTE_NAME
    },
    {
        route: Constants.UNAUTHORIZED_ROUTE_URL,
        moduleId: "account/unauthorized/unauthorized",
        title: "Unauthorized",
        auth: false,
        name: Constants.UNAUTHORIZED_ROUTE_NAME
    }
] as Array<IRoute>;