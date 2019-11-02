const listStyle = {style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal; position: relative'};
const immutableNameStyle = {style: 'color: rgb(232,98,0); position: relative'};
const keyStyle = {style: 'color: #881391'};
const defaultValueKeyStyle = {style: 'color: #777'};
const alteredValueKeyStyle = {style: 'color: #881391; font-weight: bolder'};
const inlineValuesStyle = {style: 'color: #777; font-style: italic; position: relative'}
const nullStyle = {style: 'color: #777'};

export default function createFormatter(Immutable) {

  const isRecord = maybeRecord => {
    if (maybeRecord &&
        maybeRecord._values === undefined // in v3 record
        && maybeRecord._map === undefined // in v4 record
      ) {
      // don't detect Immutable.Record.prototype as a Record instance
      return
    }
    // Immutable v4
    if (maybeRecord['@@__IMMUTABLE_RECORD__@@']) {
      // There's also a Immutable.Record.isRecord we could use, but then the
      // Immutable instance passed into createFormatter has to be the same
      // version as the one used to create the Immutable object.
      // That's especially a problem for the Chrome extension.
      return true
    }
    // Immutable v3
    return !!(
      maybeRecord['@@__IMMUTABLE_KEYED__@@'] && 
      maybeRecord['@@__IMMUTABLE_ITERABLE__@@'] &&
      maybeRecord._defaultValues !== undefined)
  }

  const reference = (object, config) => {
    if (typeof object === 'undefined')
      return ['span', nullStyle, 'undefined'];
    else if (object === 'null')
      return ['span', nullStyle, 'null'];

    return ['object', {object, config}];
  };

  const renderIterableHeader = (iterable, name = 'Iterable') =>
    ['span', ['span', immutableNameStyle, name], ['span', `[${iterable.size}]`]];


  const getKeySeq = collection => collection.toSeq().map((v, k) => k).toIndexedSeq()

  const hasBody = (collection, config) =>
    getKeySeq(collection).size > 0 && !(config && config.noPreview);

  const renderIterableBody = (collection, mapper, options = {}) => {
    if (options.sorted) {
      collection = collection.sortBy((value, key) => key);
    }
    const children = collection
      .map(mapper)
      .toList();

    const jsList = []
    // Can't just call toJS because that will also call toJS on children inside the list
    children.forEach(child => jsList.push(child))

    return [ 'ol', listStyle, ...children ];
  }

  const RecordFormatter = {
    header(record, config) {
      if (!(isRecord(record)))
        return null;

      const defaults = record.clear();
      const changed = !Immutable.is(defaults, record);

      if (config && config.noPreview)
        return ['span', changed ? immutableNameStyle : nullStyle,
          record._name || record.constructor.name || 'Record'];

      let inlinePreview;
      if (!changed) {
        inlinePreview = ['span', inlineValuesStyle, '{}'];
      } else {
        const preview = getKeySeq(record)
          .reduce((preview, key) => {
            if (Immutable.is(defaults.get(key), record.get(key)))
              return preview;
            if (preview.length)
              preview.push(', ');

            preview.push(['span', {},
              ['span', keyStyle, key + ': '],
              reference(record.get(key), {noPreview: true})
            ]);
            return preview;
          }, []);
        inlinePreview = ['span', inlineValuesStyle, '{', ...preview, '}'];
      }
      return ['span',  { style: 'position: relative'},
        ['span', immutableNameStyle, record._name || record.constructor.name || 'Record'],
        ' ', inlinePreview
      ];
    },
    hasBody,
    body(record) {
      const defaults = record.clear();
      const children = getKeySeq(record)
        .toJS()
        .map(key => {
          const style = Immutable.is(defaults.get(key), record.get(key))
            ? defaultValueKeyStyle : alteredValueKeyStyle;
          return [
            'li', {},
              ['span', style, key + ': '],
              reference(record.get(key))
            ]
        });
      return [ 'ol', listStyle, ...children ];
    }
  };

  const ListFormatter = {
    header(o) {
      if (!Immutable.List.isList(o))
        return null;
      return renderIterableHeader(o, 'List');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', ['span', keyStyle, key + ': '], reference(value)]
      );
    }
  };

  const StackFormatter = {
    header(o) {
      if (!Immutable.Stack.isStack(o))
        return null;
      return renderIterableHeader(o, 'Stack');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', ['span', keyStyle, key + ': '], reference(value)]
      );
    }
  };

  const MapFormatter = {
    header(o) {
      if (!Immutable.Map.isMap(o))
        return null;
      return renderIterableHeader(o, 'Map');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) => 
        ['li', {}, '{', reference(key), ' => ', reference(value), '}'],
        {sorted: true}
      );
    }
  };

  const OrderedMapFormatter = {
    header(o) {
      if (!Immutable.OrderedMap.isOrderedMap(o))
        return null;
      return renderIterableHeader(o, 'OrderedMap');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) => 
        ['li', {}, '{', reference(key), ' => ', reference(value), '}']
      );
    }
  };

  const SetFormatter = {
    header(o) {
      if (!Immutable.Set.isSet(o))
        return null;
      return renderIterableHeader(o, 'Set');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, value =>
        ['li', reference(value)],
        {sorted: true}
      );
    }
  };

  const OrderedSetFormatter = {
    header(o) {
      if (!Immutable.OrderedSet.isOrderedSet(o))
        return null;
      return renderIterableHeader(o, 'OrderedSet');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, value =>
        ['li', reference(value)]
      );
    }
  };

  return {
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  }
}