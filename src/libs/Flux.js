/* eslint-disable no-underscore-dangle */
import Immutable from "immutable";
import invariant from "invariant";
import { ReduceStore as FluxReduceStore } from "flux/utils";
import { Mixin as mixin } from "./Mixin";

const storesStore = [];

export function withNoMutations(handler) {
  return (state, ...rest) => {
    handler(...rest);
    return state;
  };
}


const StoreOverlay = {
  addAction(...args) {
    const actionTypes = args.slice(0, args.length - 1);
    const handlerFn = args[args.length - 1];

    actionTypes.forEach((actionType) => {
      invariant(
        actionType !== undefined,
        "%s: actionTypes can not be undefined",
        this.constructor.name
      );
      this.__actionHandlers[actionType] = handlerFn;
    });
  },

  reduce(state, action) {
    const handlerFn = this.__actionHandlers[action.type];
    if (handlerFn) {
      if (this.__dependencies.length > 0) {
        this.getDispatcher().waitFor(this.__dependencies);
      }
      return handlerFn.call(this, state, action);
    }
    return state;
  },

  waitFor(...stores) {
    stores.forEach(store => this.__dependencies.push(store.getDispatchToken()));
  },

  syncWith(stores, callback) {
    const wrapper = () => {
      const startingState = this._state;
      const endingState = callback.call(this, startingState);

      invariant(
        endingState !== undefined,
        "%s returned undefined from a syncWith(...) callback, did you forget to return " +
        "state in the default case? (use null if this was intentional)",
        this.constructor.name
      );
      if (startingState !== endingState) {
        this._state = endingState;
        this.__emitter.emit(this.__changeEvent);
      }
    };
    stores.forEach(store => store.addListener(wrapper));
  }
};

export class ReduceStore extends mixin(FluxReduceStore, StoreOverlay) {
  constructor(dispatcher) {
    super(dispatcher);
    this.__dependencies = [];
    this.__actionHandlers = {};
    storesStore.push(this);
  }

  getInitialState() {
    return Immutable.Set();
  }
}

export class MapStore extends mixin(FluxReduceStore, StoreOverlay) {
  constructor(dispatcher) {
    super(dispatcher);
    this.__dependencies = [];
    this.__actionHandlers = {};
    storesStore.push(this);
  }

  getInitialState() {
    return Immutable.Map();
  }

  get(key) {
    return this.getState().get(key);
  }

  has(key) {
    return this.getState().has(key);
  }
}

export default {
  initialize() {
    storesStore.forEach(store => store.initialize());
  }
};
