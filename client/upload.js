/* global jl */

function readSingleFile(event)
{
	jl.file.read(event.target.files[0], startConversion);
}

document.getElementById("fileinput").addEventListener("change", readSingleFile, false);

function buttonEvent()
{
	startConversion($("#input").val());
}

function startConversion(data)
{
	var parseTree = tokenizer(data);
	var category = parseTree.shift();
	category = objPropParser(category);
	var arrayJSON = toJSON(parseTree, category);
	$("#output").val(JSON.stringify(arrayJSON));
	$("#meta").val(makeBookMetaJSON());
}

function tokenizer(text)
{
	text = text.replace("\r", "");
	var parseTree = text.split("\n");
	for (var i in parseTree)
	{
		parseTree[i] = parseTree[i].split("\t");
		for (var j in parseTree[i])
		{
			if (/\S/g.test(parseTree[i][j]) && !isNaN(Number(parseTree[i][j])))
			{
				parseTree[i][j] = Number(parseTree[i][j]);
			}
		}
	}
	return parseTree;
}

// turns an array of tree notation strings into an array of
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

// adds a leaf based on its path in the tree structure
function addProp(obj, propArray, primitive)
{
	var currentLevel = obj;
	for (var i in propArray)
	{
		if (propArray[i][0] === null) // no property name so end function
		{
			break;
		}
		if (propArray[i][1] === null)
		{
			if (Number(i) === propArray.length - 1)
			{
				currentLevel[propArray[i][0]] = primitive;
			}
			else if (currentLevel[propArray[i][0]] === undefined)
			{
				currentLevel = currentLevel[propArray[i][0]] = {};
			}
		}
		else
		{
			if (currentLevel[propArray[i][0]] === undefined)
			{
				currentLevel[propArray[i][0]] = [];
			}
			if (i < propArray.length - 1)
			{
				if (currentLevel[propArray[i][0]][propArray[i][1]] === undefined)
				{
					currentLevel[propArray[i][0]][propArray[i][1]] = {};
				}
				currentLevel = currentLevel[propArray[i][0]][propArray[i][1]];
			}
			else
			{
				currentLevel[propArray[i][0]][propArray[i][1]] = primitive;
			}
		}
	}
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