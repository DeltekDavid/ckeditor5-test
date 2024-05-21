import UnitsOfMeasureEditing from "./unitsOfMeasureEditing";
import UnitsOfMeasureUI from "./unitsOfMeasureUI";
import { Plugin } from "ckeditor5";

export default class UnitsOfMeasure extends Plugin {
    static get requires() {
        return [UnitsOfMeasureEditing, UnitsOfMeasureUI];
    }
}