import { bindable } from "aurelia-framework";
import * as $ from "jquery";
import * as showdown from "showdown";


export class Hljs {
  @bindable code;
  @bindable hideCode = false;
  @bindable hideComments = false;
  converter: showdown.Converter;
  codeContainer: Element;
  renderTimeoutId: number;

  constructor() {
    this.converter = new showdown.Converter();
  }

  bind() {
    this.render();
  }

  codeChanged() {
    if (this.renderTimeoutId) clearTimeout(this.renderTimeoutId);
    this.renderTimeoutId = setTimeout(this.render.bind(this), 200);
  }

  hideCodeChanged() {
    this.render();
  }

  hideCommentsChanged() {
    this.render();
  }

  private render() {
    let value = this.code;

    if (this.hideComments) {
      let lines = this.code.split("\n");
      value = lines.filter(l => !l.trim().startsWith("//")).join("\n");
    }

    if (this.hideCode) {
      let lines = this.code.split("\n");
      value = lines.filter(l => l.trim().startsWith("//")).join("\n");
    }

    let codeHtml = this.converter.makeHtml("```javascript\n" + value + "\n```");
    $(this.codeContainer).html(codeHtml);
    $(this.codeContainer).find("pre code").each((i, block) => {
      hljs.highlightBlock(block);
    });
  }
}

