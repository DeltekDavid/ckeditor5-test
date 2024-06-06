export enum BracketContentElementType {
    Text,
    UnitsOfMeasure,
}

export interface BracketContentElement {
    type: BracketContentElementType;
    text: string;
    imperialUnits?: string;
    metricUnits?: string;
}