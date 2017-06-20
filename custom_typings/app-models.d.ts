interface ILesson {
    week: number;
    day: number;
    key: string;
    url: string;
    activities: {
        [activityKey: string]: IActivity
    }
}

interface IActivity {
    key: string;
    name: string;
    type: string;
    speedRatio: number;
    tries: number;
    hideCode: boolean;
    hideComments: boolean;
    url: string;
    view: string;
    lastUpdated: string;
    answers: {
        [answerKey: string]: IAnswer
    }
    blinks: {
        [email64: string]: IBlinkActivity
    }
}

interface IBlinkActivity {
    tries: { [anserKey: string]: number };
    user: IUserInfo;
}

interface IAnswer {
    key: string;
    value: string;
    taken: {
        [guid: string]: number
    }
}

interface IDetachListener {
    (): void;
}

interface IRoute {
    route: string | string[];
    moduleId: string;
    title?: string;
    auth?: boolean;
    admin?: boolean;
    elementId?: string;
    name?: string;
    ssoUser?: boolean;
}

interface IUserInfo {
    displayName: string;
    email: string;
}