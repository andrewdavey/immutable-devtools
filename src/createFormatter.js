const listStyle = { style: "list-style-type: none; padding: 0; margin: 0 0 0 12px" };
const keyStyle = { style: "color:#881391" };

module.exports = function createFormatter(Immutable) {

  function reference(any, config) {
    return ["object", { object: any, config: config }]
  }

  const stop = {}; // Signals formatter to stop infinite recursion

  const defaultFormatter = {
    header(x, config) {
      if (config === stop) return null;
      return reference(x, stop);
    },
    hasBody(x, config) {
      return false;
    },
    body(x, config) {
      return null;
    }
  };

  function notEmpty(collection) {
    return collection.size > 0;
  }

  function keySpan(key) {
    return [ "span", keyStyle, key + ": " ];
  }

  function displayKeyValueList(collection) {
    const children = collection
      .map((value, key) => [ "li", keySpan(key), reference(value) ])
      .toList()
      .toJS();
    return [ "ol", listStyle, ...children ];
  }

  const mapFormatter = {
    header() {
      return ["span", "Map"];
    },
    hasBody: notEmpty,
    body: displayKeyValueList
  };

  const orderedMapFormatter = {
    header() {
      return ["span", "OrderedMap"];
    },
    hasBody: notEmpty,
    body: displayKeyValueList
  };

  const listFormatter = {
    header() {
      return ["span", "List"];
    },
    hasBody: notEmpty,
    body: displayKeyValueList
  };

  function setBody(set) {
    const children = set
      .map(item => ["li", reference(item)])
      .toJS();
    return [ "ol", listStyle, ...children ];
  }

  const stackFormatter = {
    header() {
      return ["span", "Stack"];
    },
    hasBody: notEmpty,
    body: setBody
  };

  const setFormatter = {
    header() {
      return ["span", "Set"];
    },
    hasBody: notEmpty,
    body: setBody
  };

  const orderedSetFormatter = {
    header() {
      return ["span", "OrderedSet"];
    },
    hasBody: notEmpty,
    body: setBody
  };

  const recordFormatter = {
    header(record) {
      const recordName = record._name || record.constructor.name || "Record";
      return ["span", recordName];
    },
    hasBody: notEmpty,
    body(record) {
      const children = record
        .keySeq()
        .map(key => [ "li", keySpan(key), reference(record.get(key)) ])
        .toJS();
      return [ "ol", listStyle, ...children ];
    }
  };

  const immutableFormatters = {
    OrderedMap: orderedMapFormatter,
    OrderedSet: orderedSetFormatter,
    List: listFormatter,
    Map: mapFormatter,
    Set: setFormatter,
    Stack: stackFormatter
  };

  function getFormatter(any) {
    if (any instanceof Immutable.Record) return recordFormatter;
    return Object
      .keys(immutableFormatters)
      .filter(type => Immutable[type]["is" + type](any))
      .map(type => immutableFormatters[type])
      .concat(defaultFormatter) // Fallback used when not immutable value
      [0];
  }

  return {
    header(any, config) {
      return getFormatter(any).header(any, config);
    },
    hasBody(any, config) {
      return getFormatter(any).hasBody(any, config);
    },
    body(any, config) {
      return getFormatter(any).body(any, config);
    }
  };

}

