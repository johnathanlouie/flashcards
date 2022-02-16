function parseArray(name) {
    var array = {};
    var bracket1 = name.indexOf("[");
    var bracket2 = name.indexOf("]");
    var arrayIndexStr = name.substring(bracket1 + 1, bracket2);
    array.name = name.substring(0, bracket1);
    array.index = Number(arrayIndexStr);
    return array;
}

function isArray(name) {
    return name.indexOf("[") !== -1;
}

function getObject(parent, property) {
    if (typeof parent[property] !== "object" || parent[property] === null) {
        parent[property] = {};
    }
    return parent[property];
}

function getArray(parent, property) {
    if (!Array.isArray(parent[property])) {
        parent[property] = [];
    }
    return parent[property];
}

function addProperty(parent, path, value) {
    while (path.length > 0) {
        name = path.shift();
        if (isArray(name) && path.length === 0) {
            var x = parseArray(name);
            getArray(parent, x.name)[x.index] = value;
        } else if (isArray(name) && path.length > 0) {
            var x = parseArray(name);
            parent = getObject(getArray(parent, x.name), x.index);
        } else if (path.length === 0) {
            parent[name] = value;
        } else {
            parent = getObject(parent, name);
        }
    }
}

function rowHandler(header, row) {
    var obj = {};
    for (let col in header) {
        var value = row[col];
        if (value.length > 0) {
            addProperty(obj, header[col].split("."), value);
        }
    }
    return obj;
}

function main(input) {
    var output = [];
    var header = input.shift();
    for (let row of input) {
        output.push(rowHandler(header, row));
    }
    return output;
}

module.exports = main;