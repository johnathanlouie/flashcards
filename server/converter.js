exports;
function start(label, data)
{
    label = objPropParser(label);
    var arrayJSON = toJSON(data, label);
    $("#meta").val(makeBookMetaJSON());
}

// turns an array of tree notation strings into an array of labels
function objPropParser(strArray)
{
    var delimiter = '.';
    for (var i in strArray)
    {
        strArray[i] = strArray[i].split(delimiter);
        for (var j in strArray[i])
        {
            var tempArray = [null, null];
            var tempNumber = strArray[i][j].match(/\d+/);
            var tempWords = jl.string.toCamelCase(strArray[i][j]);
            if (tempWords !== "")
            {
                tempArray[0] = tempWords;
            }
            if (tempNumber !== null)
            {
                tempArray[1] = Number(tempNumber[0]);
            }
            strArray[i][j] = tempArray;
        }
    }
    return strArray;
}

function toJSON(parseTree, category)
{
    var JSONContainer = [];
    for (var i in parseTree) // i is the row number ie the term
    {
        var tempObject = {};
        for (var j in parseTree[i]) // j is the column number ie [i][j] is the leaf of the term
        {
            if (!(/\S/.test(parseTree[i][j])))
            {
                continue;
            }
            addProp(tempObject, category[j], parseTree[i][j]);
        }
        JSONContainer.push(tempObject);
    }
    return JSONContainer;
}

function makeBookMetaJSON()
{
    var obj = {
        "language": $("#language").val(),
        "title": $("#title").val()
    };
    if ($("#subtitle").val().length !== 0)
    {
        obj.subtitle = $("#subtitle").val();
    }
    obj.author = [];
    for (let i of [$("#author1").val(), $("#author2").val(), $("#author3").val(), $("#author4").val(), $("#author5").val()])
    {
        if (i.length !== 0)
        {
            obj.author.push(i);
        }
    }
    return JSON.stringify(obj);
}