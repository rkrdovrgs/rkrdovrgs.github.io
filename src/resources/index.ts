﻿import { FrameworkConfiguration } from "aurelia-framework";

export function configure(config: FrameworkConfiguration) {
    let resources = [
        //value-converters
        './value-converters/match-by',
        './value-converters/moment-format',
        './value-converters/pattern',

        //elements
        './elements/section-async/section-async',
    ];

    config.globalResources(resources);
}