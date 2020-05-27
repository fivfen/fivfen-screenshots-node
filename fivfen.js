"use strict";
const hmacSha1 = require("sha1");

const DEFAULT_PREFIX = "https://fivfen.com/api?v=v1";

module.exports = (key, secret = null, prefix = DEFAULT_PREFIX) => {
  return {
    buildUrl: options => {
      options = validateOptions(options);
      const query = toQueryString(options);
      if (secret) {
        const token = generateToken(query, secret);
        return prefix + '&key=' + key + '&sec=' + token + query;
      } else {
        return prefix + '&key=' + key + query;
      }
    }
  };
};

const generateToken = (queryString, secret) => {
  const sha = hmacSha1.jsSHA('SHA-1', 'TEXT', {hmacKey: {value: secret, format: 'TEXT'}});
  sha.update(queryString);
  return sha.getHash('HEX');
};

const toQueryString = (options) => {
  const filterFunc = (key, value) => {
    console.log("in filter", key, value);
    if (
      key === "token" ||
      key === "key" ||
      !value
    ) {
      return;
    }
    return value;
  };
  const fixedEncodeURIComponent = str => {
    console.log("before", str);
    let result = encodeURIComponent(str).replace(
      /[!'()*]/g,
      c =>
        "%" +
        c.charCodeAt(0)
          .toString(16)
          .toUpperCase()
    );
    console.log("after", result);
    return result;
  };
  return qs.stringify(options, {
    encoder: fixedEncodeURIComponent,
    filter: filterFunc,
    arrayFormat: "repeat"
  });
};

const validateOptions = options => {
  let query, ret, token;
  if (!options) {
    throw new Error("no options object passed");
  }
  if (typeof options.url !== "string") {
    throw new Error(
      "url should be of type string (something like www.google.com)"
    );
  }
  if (options.url === null) {
    throw new Error("url is required");
  }
  return Object.assign({}, DEFAULT_OPTIONS, options);
};
