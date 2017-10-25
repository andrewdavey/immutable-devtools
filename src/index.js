import createFormatters from './createFormatters';

// Check for globally defined Immutable and add an install method to it.
if (typeof Immutable !== "undefined") {
  Immutable.installDevTools = install.bind(null, Immutable);
}

// I imagine most people are using Immutable as a CommonJS module though...

let installed = false;
function install(Immutable) {
  const gw = typeof window === "undefined" ? global : window;

  // Don't install more than once.
  if (installed === true) {
    return;
  }

  gw.devtoolsFormatters = gw.devtoolsFormatters || [];

  const {
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  } = createFormatters(Immutable);

  gw.devtoolsFormatters.push(
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  );

  installed = true;
}

module.exports = install;
export default install;
