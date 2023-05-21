export default class UnwindStatement {
  constructor(...args) {
    this._unwind = args
  }

  toString() {
    const vars = this._unwind.join(",")
    return `UNWIND ${vars}`
  }
}
