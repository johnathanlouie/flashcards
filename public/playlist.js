var playlist = {};
var cards = [];
var chapters = new Map();

playlist.add = function (bookId, chapterNum, cardsArray)
{
    var id = createId(bookId, chapterNum);
    chapters.set(id, cardsArray);
    safeAdd(cardsArray);
};

playlist.remove = function (bookId, chapterNum)
{
    var id = createId(bookId, chapterNum);
    chapters.delete(id);
    cards = [];
    for (var chapter of chapters.values())
    {
        safeAdd(chapter);
    }
};

function filterFunc(currentValue)
{
    return typeof currentValue !== "undefined";
}

function safeAdd(cardsArray)
{
    var filteredArray = cardsArray.filter(filterFunc);
    cards = cards.concat(filteredArray);
}

function createId(bookId, chapterNum)
{
    return bookId + "-" + chapterNum;
}

playlist.getCards = function ()
{
    return cards.slice();
};

playlist.isEmpty = function ()
{
    return cards.length === 0;
};

export default playlist;