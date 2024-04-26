import BracketOptionEditing from "./bracketOptionEditing";
import BracketOptionUI from "./bracketOptionUI";

import { Plugin } from "@ckeditor/ckeditor5-core";

export default class BracketOption extends Plugin {
    static get requires() {
        return [BracketOptionEditing, BracketOptionUI];
    }
}