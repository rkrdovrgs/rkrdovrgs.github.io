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
    number: number;
    name: string;
    url: string;
    view: string;
    answers: {
        [key: string]: IAnswer
    }
}

interface IAnswer {
    key: string;
    value: string;
    html: string;
    taken: {
        [guid: string]: number
    }
}

interface IDetachListener {
    (): void;
}