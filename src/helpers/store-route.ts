import { PipelineStep, Next, NavigationInstruction } from "aurelia-router";
import { Storage } from "./storage";
import { inject } from "aurelia-framework";

@inject(Storage)
export class StoreRoute implements PipelineStep {
    constructor(private storage: Storage) { }

    run(instruction: NavigationInstruction, next: Next) {
        if (instruction.getAllInstructions().some((i: any) => (<IRoute>i.config).auth)) {
            this.storage.returnUrl = `${instruction.fragment}`;
        }
        return next();
    }
}