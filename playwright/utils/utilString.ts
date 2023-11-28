import { APIS_KEY } from "lib/api/apis";
import getQueryParamString from "lib/router/getQueryParamString";

export const setApiChain: any = (router: any) => {
    const hash = getQueryParamString(router.query.hash);
    
    const key = hash.substring(2,6);
    
    if (APIS_KEY[key] === undefined) {
        return ;
    }
    const api = APIS_KEY[key] + hash
    return api;
}