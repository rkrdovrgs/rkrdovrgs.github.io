import { ActivityViewer } from "activity-viewer/activity-viewer";

export class CustomViewer {
    model: ActivityViewer;

    bind(context, { parentOverrideContext }) {
        this.model = parentOverrideContext.bindingContext;
    }
}