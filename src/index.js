import createFormatter from "./createFormatter";

let installed = false;

// Check for globally defined Immutable and add an install method to it.
if (typeof Immutable !== "undefined") {
  Immutable.installDevTools = install.bind(null, Immutable);
}

// I imagine most people are using Immutable as a CommonJS module though...

export default function install(Immutable) {

  if (typeof window === undefined) {
    throw new Error("Can only install immutable-devtools in a browser environment.");
  }

  // Don't install more than once.
  if (installed === true) {
    return;
  }

  window.devtoolsFormatters = window.devtoolsFormatters || [];

  window.devtoolsFormatters.push(createFormatter(Immutable));

  installed = true;
}

