import { APIS_KEY } from "lib/api/apis";
import getQueryParamString from "lib/router/getQueryParamString";

export const setApiChain: any = (router: any) => {
    const hash = getQueryParamString(router.query.hash);
    
    const key = hash.substring(2,6);
    // @ts-ignore: Unreachable code error
    if (APIS_KEY[key] === undefined) {
        return ;
    }
    // @ts-ignore: Unreachable code error
    const api = APIS_KEY[key] + hash
    return api;
}