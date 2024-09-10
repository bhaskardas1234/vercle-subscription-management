// import { UAParser } from "ua-parser-js";

// const parser = new UAParser();

// export const getParsedUA = (userAgent) => {
//     let result = parser.getResult(userAgent);
//     return result;
// }


import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export const getParsedUA = (userAgent) => {
    parser.setUA(userAgent);
    let result = parser.getResult();
    return result;
}