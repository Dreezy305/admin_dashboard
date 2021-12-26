/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable no-control-regex */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
"use strict";
const crypto = require("crypto");
const moment = require("moment");

const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const percentage = (current, total) => {
  let val = current / total;
  val = val.toFixed(1);
  val = val * 100;
  return val;
};

const encrypt = (val) => {
  const cipher = crypto.createCipheriv("aes192", process.env.APP_SECRET, 24);
  let encrypted = cipher.update(val, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (val) => {
  const decipher = crypto.createDecipheriv(
    "aes192",
    process.env.APP_SECRET,
    24
  );
  const encrypted = val;
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const accurateMonth = (val) => {
  val = val < 10 ? `0${val}` : val;
  val = `${moment().format("YYYY")}-${val}-10`;
  val = moment(val).endOf("month").format("D");
  val = parseInt(val);
  return val;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const ageToDob = (age) => {
  const ageInMillis = age * 365 * 24 * 60 * 60;
  const dateOfBirth = new Date(new Date().getTime() - ageInMillis);
  const date = moment(dateOfBirth).subtract("years", age);
  return date;
};

const validateEmail = (email) => {
  let format =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  email = email.match(format);
  if (email) {
    return true;
  } else {
    return false;
  }
};

const validatePhone = (phone) => {
  let format = /^\d{11}$/;
  phone = phone.match(format);
  if (phone) {
    return true;
  } else {
    return false;
  }
};

const parseCurrency = (money) => {
  money = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(money);
  return money;
};

const parseNumber = (number) => {
  number = new Intl.NumberFormat("en-NG", {
    style: "decimal",
  }).format(number);
  return number;
};

const randomString = (length) => {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
};

const sumOdd = (odds) => {
  let value = [];
  if (odds.length) {
    value = odds.map((item) => Number(item.odd));
  }
  return value;
};

module.exports = {
  guid,
  percentage,
  encrypt,
  decrypt,
  accurateMonth,
  asyncForEach,
  ageToDob,
  validateEmail,
  validatePhone,
  parseCurrency,
  parseNumber,
  randomString,
  sumOdd,
};
