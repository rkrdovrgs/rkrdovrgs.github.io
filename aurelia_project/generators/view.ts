import {inject} from 'aurelia-dependency-injection';
import {Project, ProjectItem, CLIOptions, UI} from 'aurelia-cli';

@inject(Project, CLIOptions, UI)
export default class ViewGenerator {
    constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

    execute() {
        return this.ui
            .ensureAnswer(this.options.args[0], 'What would be the view path (e.g. dashboard/my-view)?')
            .then(path => {
                let name = path.split('/').pop();
                let fileName = this.project.makeFileName(name);
                let className = this.project.makeClassName(name);

                this.project.root.add(
                    ProjectItem.text(`${path}/${fileName}.ts`, this.generateJSSource(className)),
                    ProjectItem.text(`${path}/${fileName}.html`, this.generateHTMLSource(path, fileName)),
                    ProjectItem.text(`${path}/${fileName}.less`, this.generateLESSSource(fileName))
                );

                return this.project.commitChanges()
                    .then(() => this.ui.log(`Created ${fileName}.`));
            });
    }

    generateJSSource(className) {
        return `import {inject} from 'aurelia-framework';

export class ${className} {

}

`
    }

    generateHTMLSource(path: string, fileName: string) {
        return `<template>
    <require from="${path}/${fileName}.css"></require>
    <h1>View: ${fileName}</h1>
</template>`
    }

    generateLESSSource(fileName) {
        return `@import (reference) "./content/less/base.less";

#${fileName} {
    h1 {
        color: red;
    }
}`
    }
}
