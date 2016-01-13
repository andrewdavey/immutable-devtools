const listStyle = {style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px'};
const immutableNameStyle = {style: 'color: rgb(232,98,0)'};
const keyStyle = {style: 'color:#881391'};
const alteredValueKeyStyle = {style: 'color:#881391; font-weight: bolder'};
const nullStyle = {style: 'color: #777'};

export default function createFormatter(Immutable) {

  const reference = (object, config) => {
    if (typeof object === 'undefined')
      return ['span', nullStyle, 'undefined'];
    else if (object === 'null')
      return ['span', nullStyle, 'null'];

    return ['object', {object, config}];
  };

  const displayKeyValueList = (collection) => {
    const children = collection
      .map((value, key) => ['li', reference(key), ': ', reference(value)])
      .toList()
      .toJS();
    return [ 'ol', listStyle, ...children ];
  }

  const renderIterableHeader = (iterable, name = 'Iterable') =>
    ['span', ['span', immutableNameStyle, name], ['span', ` (${iterable.size})`]];

  const hasBody = (collection) => collection.size > 0;

  const RecordFormatter = {
    header(record) {
      if (!(record instanceof Immutable.Record))
        return null;
      return ['span', immutableNameStyle, record._name || record.constructor.name || 'Record']
    },
    hasBody,
    body(record) {
      const defaults = record.clear();
      const children = record
        .keySeq()
        .map(key => {
          const style = Immutable.is(defaults.get(key), record.get(key))
            ? keyStyle : alteredValueKeyStyle;
          return [
            'li', {},
              ['span', style, key + ': '],
              reference(record.get(key))
            ]
        }).toJS();
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
    body: displayKeyValueList
  };

  const StackFormatter = {
    header(o) {
      if (!Immutable.Stack.isStack(o))
        return null;
      return renderIterableHeader(o, 'Stack');
    },
    hasBody,
    body: displayKeyValueList
  };

  const MapFormatter = {
    header(o) {
      if (!Immutable.Map.isMap(o))
        return null;
      return renderIterableHeader(o, 'Map');
    },
    hasBody,
    body: displayKeyValueList
  };

  const OrderedMapFormatter = {
    header(o) {
      if (!Immutable.OrderedMap.isOrderedMap(o))
        return null;
      return renderIterableHeader(o, 'OrderedMap');
    },
    hasBody,
    body: displayKeyValueList
  };

  const SetFormatter = {
    header(o) {
      if (!Immutable.Set.isSet(o))
        return null;
      return renderIterableHeader(o, 'Set');
    },
    hasBody,
    body: displayKeyValueList
  };

  const OrderedSetFormatter = {
    header(o) {
      if (!Immutable.OrderedSet.isOrderedSet(o))
        return null;
      return renderIterableHeader(o, 'OrderedSet');
    },
    hasBody,
    body: displayKeyValueList
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