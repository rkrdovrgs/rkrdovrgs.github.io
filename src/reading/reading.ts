import * as _ from "lodash";
import { BaseApiService } from "dataservices/base";
import { inject } from "aurelia-framework";

@inject(BaseApiService)
export class Reading {
    words: Array<{
        w: string,
        skip: boolean
    }> = [];
    newWord: string = "";
    currentWord: string = "";
    currentImg: string = "";
    cIndex: number = null;
    spell: boolean = true;

    constructor(private api: BaseApiService) { }

    activate() {
        this.words = JSON.parse(localStorage.getItem("reading.words")) || [];
    }

    addWord(e: KeyboardEvent = null) {
        if (!!e && e.key.toLocaleLowerCase() !== "enter") {
            return;
        }

        this.words.unshift({ w: this.newWord, skip: false });
        this.newWord = "";

        this.updateStorage();
    }

    randomX(x: number = 3) {
        this.words = this.getRandomWords(false);
        for (let i = 0; i < this.words.length; i++) {
            this.words[i].skip = i > (x - 1);
        }
    }

    getRandomWords(skip = true) {
        return _(this.words)
            .filter(w => !skip || !w.skip)
            .orderBy(() => Math.random())
            .value();
    }

    async startReading() {
        for (let w of this.getRandomWords()) {
            this.currentWord = w.w;
            const delay = w.w.split(" ").length * 2250;
            await this.wait(delay);
            await this.read(w.w);

            if (this.spell) {
                await this.wait(750);
                for (let i = 0; i < w.w.length; i++) {
                    this.cIndex = i;
                    await this.read(w.w[i]);
                    await this.wait(250);
                }
                this.cIndex = null;
                await this.wait(250);
                await this.read(w.w);
            }

            await this.wait(delay);
        }

        this.currentWord = "";
    }

    read(value: string): Promise<SpeechSynthesisEvent> {
        return new Promise(res => {
            const r = new SpeechSynthesisUtterance(value);
            speechSynthesis.speak(r);
            r.onend = res;
        });

    }

    wait(ms: number): Promise<void> {
        return new Promise(res => setTimeout(res, ms));
    }

    removeWord(index) {
        this.words.splice(index, 1);
        this.updateStorage();
    }

    toggleWord(index) {
        this.words[index].skip = !this.words[index].skip;
        this.updateStorage();
    }

    updateStorage() {
        localStorage.setItem("reading.words", JSON.stringify(this.words));
    }


    mixAndMatchSettings = {
        // visible options for the user to choose from
        // they should change every time as these should be randomized
        options: [] as Array<string>,
        // all enabled words before the game starts
        enabledWords: [] as Array<string>,
        // since we are going 3 words at a time, each section is 3 words
        // keep track of current section
        currentSectionIndex: -1,
        // current index at the current section
        currentIndex: -1,
        // current word
        get currentWord(): string {
            return this.currentOptions[this.currentIndex];
        },
        // correct index at the current section
        correctIndex: -1,
        // current options at the current section
        currentOptions: [] as Array<string>,
        // keeps track of the score
        // player is only allowed to the next section 
        // only if they matched the 3 words of the current section
        currentScore: 0,
        // temporary flag to show correct answers
        showingCorrectAnswer: false
    };

    async mixAndMatch() {
        this.mixAndMatchSettings.enabledWords = this.getRandomWords().map(w => w.w);
        if (this.mixAndMatchSettings.enabledWords.length < 3) {
            alert("Select at least 3 words");
            return;
        }

        this.mixAndMatchSettings.currentSectionIndex = 0;

        this.mixAndMatchSection();
    }

    mixAndMatchSection() {
        this.mixAndMatchSettings.currentOptions =
            this.mixAndMatchSettings.enabledWords
                .slice(this.mixAndMatchSettings.currentSectionIndex)
                .slice(0, 3);

        for (let i = 0; this.mixAndMatchSettings.currentOptions.length < 3; i++) {
            this.mixAndMatchSettings.currentOptions.push(this.mixAndMatchSettings.enabledWords[i]);
        }

        this.mixAndMatchSettings.currentOptions = _(this.mixAndMatchSettings.currentOptions).orderBy(() => Math.random()).value();

        this.mixAndMatchSettings.currentIndex = 0;
        this.mixAndMatchSettings.currentScore = 0;

        this.nextMixAndMatch();
    }

    async verifyMixAndMatch(index) {
        if (index === this.mixAndMatchSettings.correctIndex) {
            this.mixAndMatchSettings.currentScore++;
        }

        this.mixAndMatchSettings.showingCorrectAnswer = true;
        await this.wait(2250);

        this.mixAndMatchSettings.currentIndex++;
        if (this.mixAndMatchSettings.currentIndex < 3) {
            this.nextMixAndMatch();
        } else {
            if (this.mixAndMatchSettings.currentScore === 3) {
                this.mixAndMatchSettings.currentSectionIndex++;
            }

            if (this.mixAndMatchSettings.currentSectionIndex < this.mixAndMatchSettings.enabledWords.length) {
                this.mixAndMatchSection();
            } else {
                await this.read("Finished");
                this.mixAndMatchSettings.options = [];
            }
        }
    }

    async nextMixAndMatch() {
        this.mixAndMatchSettings.showingCorrectAnswer = false;

        this.mixAndMatchSettings.options = _(this.mixAndMatchSettings.currentOptions).orderBy(() => Math.random()).value();
        this.mixAndMatchSettings.correctIndex = this.mixAndMatchSettings.options.indexOf(this.mixAndMatchSettings.currentWord);

        await this.read(this.mixAndMatchSettings.currentWord);
    }


    repeatMixAndMatch() {
        this.read(this.mixAndMatchSettings.currentWord);
    }
}