// https://stackoverflow.com/a/48342359
export class ProflificError extends Error {
  constructor (message?: string) {
    super(message)
    const actualProto = new.target.prototype
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto)
    } else {
      ;(<any>this).__proto__ = actualProto // eslint-disable-line
    }
  }
}
