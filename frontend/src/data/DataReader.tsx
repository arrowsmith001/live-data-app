

export class DataReader {

    schema: DataSchema;

    constructor(schema: DataSchema) {
        this.schema = schema;
    }

    readLine(line: string): any[] | { error: number } {
        let values = line.split(this.schema.delimeter);
        let result = [];
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            switch (this.schema.types[i]) {
                case DataType.STRING:
                    result.push(value);
                    break;
                case DataType.NUMBER:
                    const f = parseFloat(value);
                    if (isNaN(f)) return { error: i };
                    result.push(f);
                    break;
                case DataType.TIMESTAMP:
                    const f2 = parseFloat(value);
                    if (isNaN(f2)) return { error: i };
                    // split milliseconds
                    const d = new Date(f2 * 1000);
                    console.log(d.toString());
                    if (isNaN(d.getTime())) return { error: i };
                    result.push(d);
                    break;
                case DataType.BOOLEAN:
                    const b = value === "true" ? true : value === "false" ? false : null;
                    if (b === null) return { error: i };
                    result.push(value === "true");
                    break;
            }
        }
        return result;
    }

}

export class DataSchema {

    labels: string[];
    types: DataType[];
    delimeter: string;

    constructor(labels: string[], types: DataType[], delimeter: string) {
        this.labels = labels;
        this.types = types;
        this.delimeter = delimeter;
    }
}

export enum DataType {
    STRING, NUMBER, TIMESTAMP, BOOLEAN
}