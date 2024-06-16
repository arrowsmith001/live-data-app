import { ConnectionInfo, DataViewType, DataViewTypeInputs, Error } from "../api/model";


export function getUrlFromConnectionInfo(ci: ConnectionInfo): string {

    if (ci.endpoint === "") return ci.ip + ":" + ci.port;
    else return ci.ip + ":" + ci.port + "/" + ci.endpoint;
}

export function validateArgMapping(type : DataViewType, inputMapping: {[key: number]: number}) : Error | undefined {
    let err = '';
    DataViewTypeInputs[type].forEach((input, i) => {
        if (inputMapping[i] === undefined || null) {
            if (err === '') err = `Missing input(s): ` + input.label;
            else err += `, ` + input.label;
        }
    });
    return err === '' ? undefined : {errorType: 'input', message: err};
}

export function getDataConfigError(config: any) : Error | undefined {

    const { connectionId, schemaId, inputMapping, type } = config;

    if(connectionId === undefined || connectionId < 0) {
        return {errorType: 'connection', message: 'No connection configured'};
    }
    if(schemaId === undefined || schemaId < 0) {
        return {errorType: 'schema', message: 'No schema configured'};
    }
    return validateArgMapping(type, inputMapping);
}