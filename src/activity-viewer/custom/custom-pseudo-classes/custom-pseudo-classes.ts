import * as firebase from "firebase";
import { LessonsService } from "dataservices/lessons";
import { Storage } from "helpers/storage";
import { inject } from "aurelia-framework";
import { CustomViewer } from "../custom-viewer";

@inject(LessonsService, Storage)
export class CustomPseudoClasses extends CustomViewer {
    pseudoClassAnswer;
    pseudoClassCss = "";
    pseudoClassCssTargeted = "";
    pseudoAsignees = [];

    constructor(private lessonService: LessonsService, private storage: Storage) {
        super();
    }

    attached() {
        this.model.answers = [this.model.takeAnswer()];
        this.loadPseudoClassAnswer();
    }

    pseudoClassRef() {
        return firebase.database().ref("custom-pseudo-classes-answers").child(this.model.answers[0].key);
    }

    updatePseudoClassAnswer() {
        this.pseudoClassAnswer.cssRule = this.model.answers[0].value
            .substring(this.model.answers[0].value.indexOf("/*"))
            .replace("?", this.pseudoClassAnswer.selector || "?")
            .replace("[TODO]", this.pseudoClassAnswer.description || "[TODO]");
        this.pseudoClassRef().set(this.pseudoClassAnswer);
    }

    loadPseudoClassAnswer() {
        this.pseudoClassAnswer = {
            description: "",
            selector: "",
            cssRule: "",
            author: this.storage.email
        };

        this.pseudoClassRef().on("value", answerSnap => {
            this.pseudoClassAnswer = answerSnap.val() || this.pseudoClassAnswer;
        });


        this.pseudoClassRef().parent.on("value", cssSnap => {
            this.pseudoClassCss = "/* GLOSARY - PSEUDO CLASSES */\n\n" +
                Object.values(cssSnap.val()).map((r: { cssRule: string }) => r.cssRule).join("\n\n");

            this.pseudoClassCssTargeted = this.pseudoClassCss.replace(/\*\*\/\n/g, "**/\n#pseudo-area ");
        });

        this.lessonService.getAsignees(this.model.lesson.key, this.model.activity.key, this.model.answers[0].key, snapAsg => {
            if (!snapAsg.val()) return;
            this.pseudoAsignees = Object.values(snapAsg.val()).map((asg: { email: string }) => asg.email.substring(0, asg.email.indexOf("@")));
        });
    }
}