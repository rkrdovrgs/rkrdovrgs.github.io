export class MatchByValueConverter {
    toView(obj, matchPropertyName, objs) {
        return obj ? obj[matchPropertyName] : null;
    }

    fromView(value, matchPropertyName, objs) {
        return objs.find(o => o[matchPropertyName] === value);
    }
}

