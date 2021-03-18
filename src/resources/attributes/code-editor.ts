import { inject } from "aurelia-framework";

@inject(Element)
export class CodeEditorCustomAttribute {
    constructor(private element: Element) {
        this.codeTab = this.codeTab.bind(this);
    }

    attached() {
        this.element.addEventListener("keydown", this.codeTab);
    }

    detached() {
        this.element.removeEventListener("keydown", this.codeTab);
    }

    codeTab(e: KeyboardEvent) {
        if (e.key === "Tab") {
            document.execCommand("insertText", false, "   ");
            e.preventDefault();
        }
    }
}