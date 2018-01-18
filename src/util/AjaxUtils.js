/**
 * Created by chenwei on 17/3/9.
 */
import {config} from '../config';

export function ajaxUtil(contentType, url, data, that, callback) {
    fetch(config.baseUrl + url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": genDetailContentType(contentType)
        },
        body: genRequestBody(contentType, data)
    }).then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson);
            if (responseJson.head) {
                if (responseJson.head.stateCode === 200) {
                    callback(responseJson.body, that);
                } else if (responseJson.head.stateCode === 400) {
                    console.log("登录超时, 请重新登录");
                    setTimeout(global.router.history.push('/login'), 100);
                } else {
                    console.error(responseJson.head)
                }
            }else{
                callback(responseJson, that);
            }
            return null;
        }).catch((error) => {
        console.error(error);
    });
}

function genDetailContentType(type) {
    switch (type) {
        case "urlencoded":
            return "application/x-www-form-urlencoded";
        case "json":
            return "application/json";
        default:
            return "";
    }
}

function genRequestBody(type, data) {
    switch (type) {
        case "urlencoded":
            return data;
        case "json":
            return JSON.stringify(data);
        default:
            return "";
    }
}
