
import { ConnectionInfo, addConnection, deleteConnection, getConnections } from "../api/ApiFunctions";

export function getUrlFromConnectionInfo(ci: ConnectionInfo): string {

    if (ci.endpoint == "") return ci.ip + ":" + ci.port;
    else return ci.ip + ":" + ci.port + "/" + ci.endpoint;
}