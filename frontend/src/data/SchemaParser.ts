import { SchemaInfo, DataType } from "../api/model";


export class SchemaParser {
    static parse(data: any, schemaId: number) {

        const schema = SchemaParser.schemas[schemaId];
        const out = [];
        if(schema.format === 'json') throw new Error('JSON format not supported YET!'); // TODO: handle json format

        const split = data.split(schema.delimiter); // TODO: be more liberal in schema-data mismatches
        if(schema.count !== split.length) throw new Error('Schema count does not match data count');

        for(let i = 0; i < schema.count; i++) {
            const datum = split[i];
            let value;
            try{
                value = this.parseValue(datum, schema.types[i]);
            }catch(e){
                throw new Error('Error parsing value: "' + datum + '" to type ' + schema.types[i]);
            }
            out.push(value);
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

    private static parseValue(value: any, type: DataType) {
        if (type === 'float') {
            return parseFloat(value);
        }
        else if (type === 'integer') {
            return parseInt(value);
        }
        else if (type === 'string') {
            return value.toString();
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