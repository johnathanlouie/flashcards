var indexCache = null;
var booksCache = {};
var chaptersCache = {};

const SERVER_URI = "library";

function getIndex(callback)
{
    function cb(serverMessage, textStatus, jqXHR)
    {
        // TODO error handling
        indexCache = serverMessage.data;
        callback(undefined, indexCache);
    }
    if (indexCache === null)
    {
        $.getJSON(SERVER_URI, "", cb);
    }
    else
    {
        callback(undefined, indexCache);
    }
}

function getBook(id, callback)
{
    function cb(serverMessage, textStatus, jqXHR)
    {
        // TODO error handling
        booksCache[id] = serverMessage.data;
        callback(undefined, booksCache[id]);
    }
    if (typeof booksCache[id] === "undefined")
    {
        $.getJSON(`${SERVER_URI}/book/${id}`, "", cb);
    }
    else
    {
        callback(undefined, booksCache[id]);
    }
}

function getChapter(id, callback)
{
    function cb(serverMessage, textStatus, jqXHR)
    {
        // TODO error handling
        chaptersCache[id] = serverMessage.data;
        callback(undefined, chaptersCache[id]);
    }
    if (typeof chaptersCache[id] === "undefined")
    {
        $.getJSON(`${SERVER_URI}/chapter/${id}`, "", cb);
    }
    else
    {
        callback(undefined, chaptersCache[id]);
    }
}

const lib = {};
lib.getIndex = getIndex;
lib.getBook = getBook;
lib.getChapter = getChapter;
export default lib;