import { Plugin } from "ckeditor5";
import UnitsOfMeasureEditing from "./unitsOfMeasureEditing";
import UnitsOfMeasureUI from "./unitsOfMeasureUI";

export default class UnitsOfMeasure extends Plugin {
    static get requires() {
        return [UnitsOfMeasureEditing, UnitsOfMeasureUI];
    }
}