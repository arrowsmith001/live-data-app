import { SchemaInfo, SchemaType } from "../api/model";


export class SchemaParser {
    static parse(data: any, schemaId: number) {

        const schema = SchemaParser.schemas[schemaId];
        const out = [];
        for(let i = 0; i < schema.count; i++) {
            out.push(SchemaParser.parseOne(schema, data, i));
        }
        return out;
    }
    

    private static schemas: { [id: number]: SchemaInfo } = {};

    static addSchema(schema: SchemaInfo) {
        if(schema.id) SchemaParser.schemas[schema.id] = schema;
    }

    static parseOne(schema: SchemaInfo, data: any, arg: any) {

        const { type, value } = SchemaParser.getTypeAndValue(schema, data, arg);

        return SchemaParser.parseValue(value, type);

    }

    static parseMultiple(schema: SchemaInfo, data: any, args: any[]) {
        const parsed = [];
        for (const arg of args) {
            const { type, value } = SchemaParser.getTypeAndValue(schema, data, arg);
            console.log('type: ' + type + ', value: ' + value);
            const v = SchemaParser.parseValue(value, type);
            parsed.push(v);
        }
        return parsed;
    }

    private static parseValue(value: any, type: SchemaType) {
        if (type === 'float') {
            return parseFloat(value);
        }
        else if (type === 'integer') {
            return parseInt(value);
        }
        else if (type === 'string') {
            return value;
        }
        else if (type === 'boolean') {
            return value === 'true';
        }
        else if (type === 'timestamp') {
            return parseFloat(value) * 1000;
        }
    }

    private static getTypeAndValue(schema: SchemaInfo, data: any, arg: any) {
        var type, value;
        if (Number.isNaN(arg)) {
            const obj = JSON.parse(data);
            const index = schema.labels.indexOf(arg);
            type = schema.types[index];
            value = obj[arg];
        }
        else {
            type = schema.types[arg];
            value = data.split(schema.delimiter)[arg];
        }

        return { type, value };
    }

}