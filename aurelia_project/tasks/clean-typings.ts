import * as gulp from 'gulp';
import * as del from 'del';
import project from './project';

export default function cleanTypings() {
    return del(["typings"]);
}

