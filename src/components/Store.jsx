"use strict";

import { makeAutoObservable, observable, action } from "mobx";

class Store {
  bonus = [];

  constructor() {
    makeAutoObservable(this);
  }

  setBonus(data) {
    this.bonus = data;
  }
}

const store = new Store();

export default store;
