import BracketOptionEditing from "./bracketOptionEditing";
import BracketOptionUI from "./bracketOptionUI";

import { Plugin } from "ckeditor5";

export default class BracketOption extends Plugin {
    static get requires() {
        return [BracketOptionEditing, BracketOptionUI];
    }
}