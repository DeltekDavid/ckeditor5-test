import BracketOptionEditing from "./bracketOptionEditing";
import BracketOptionUI from "./bracketOptionUI";

import { Plugin } from "ckeditor5";

export default class BracketOptions extends Plugin {
    static get requires() {
        return [BracketOptionEditing, BracketOptionUI];
    }
}