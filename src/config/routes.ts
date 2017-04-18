export default [
    {
        name: "activity-viewer",
        route: ["lessons/:lessonKey/activities/:activityKey/answers"],
        moduleId: "activity-viewer/activity-viewer",
        title: "Activity Answers"
    },
    {
        name: "lesson-activity-details",
        route: ["admin/lessons/:lessonKey/activities/add", "admin/lessons/:lessonKey/activities/:activityKey"],
        moduleId: "admin/lesson-activity-details/lesson-activity-details",
        title: "Activity Details"
    },
    {
        name: "lesson-details",
        route: ["admin/lessons/add", "admin/lessons/:key"],
        moduleId: "admin/lesson-details/lesson-details",
        title: "Lesson Details"
    },
    {
        name: "lessons",
        route: ["admin/lessons"],
        moduleId: "admin/lessons/lessons",
        title: "Lessons"
    }
] as Array<IRoute>