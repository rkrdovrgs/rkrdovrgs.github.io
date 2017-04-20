interface ILesson {
    week: number;
    day: number;
    key: string;
    url: string;
    activities: {
        [key: string]: IActivity
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
    answers: {
        [key: string]: IAnswer
    }
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