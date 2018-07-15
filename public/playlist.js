var cards = [];
var chapters = new Map();

function add(bookId, chapterNum, cardsArray)
{
    var id = createId(bookId, chapterNum);
    chapters.set(id, cardsArray);
    safeAdd(cardsArray);
}

function remove(bookId, chapterNum)
{
    var id = createId(bookId, chapterNum);
    chapters.delete(id);
    cards = [];
    for (var chapter of chapters.values())
    {
        safeAdd(chapter);
    }
}

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

function getCards()
{
    return cards.slice();
}

function isEmpty()
{
    return cards.length === 0;
}

const playlist = {};
playlist.add = add;
playlist.remove = remove;
playlist.getCards = getCards;
playlist.isEmpty = isEmpty;

export default playlist;