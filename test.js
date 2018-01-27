// Run `node --inspect --inspect-brk test.js`, open the debugger, and check everything renders correctly
// Note that this will only test Immutable v4!

var Immutable = require("immutable");

var installDevTools = require("./dist");
installDevTools(Immutable);

class ABRecord extends Immutable.Record({a:1,b:2}) {
    getAB() {
        return this.a + this.b;
    }
}

console.log("Record object itself, not a record instance - make sure there are no errors", ABRecord)

var Xyz = new Immutable.Map({a: new Immutable.Map({b:8})})
console.log("Expand this and check child renders as a Map", Xyz)

var Foo = Immutable.Record({bar: new Immutable.Map({a: 5}) })
var f = Foo()
console.log("Expand this and check child renders as a Map", f)

var record = new ABRecord();
var record2 = new ABRecord({a: 2});
console.log(record);
console.log(record2);

var orderedMap = Immutable.OrderedMap({key: "value"});
var orderedMap2 = Immutable.OrderedMap([["key", "value"], ["key2", "value2"]]);
console.log(orderedMap);
console.log(orderedMap2);

var orderedSet = Immutable.OrderedSet(["hello", "aaa"]);
console.log(orderedSet);

var list = Immutable.List(["hello", "world"]);
console.log(list)

var map = Immutable.Map({hello: "world"})
console.log(map)

var set = Immutable.Set(["hello", "aaa"])
console.log(set)

var stack = Immutable.Stack(["hello", "aaa"])
console.log(stack)

debugger