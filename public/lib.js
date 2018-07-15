import player from "./player.js";
var cache = null;
const SERVER_URI = "library";

function getIndexCallback(jsonObj, textStatus, jqXHR)
{
    cache = [];
    for (let book of jsonObj)
    {
        cache[book.id] = book;
    }
    player.indexcb(cache);
}

function getIndex()
{
    if (cache === null)
    {
        $.getJSON(SERVER_URI, "", getIndexCallback);
    }
    else
    {
        player.indexcb(cache);
    }
}

function getBook(bookid)
{
    function cb(jsonObj, textStatus, jqXHR)
    {
        var chapters = [];
        for (let card of jsonObj)
        {
            for (let loc of card.index)
            {
                var ch = loc.chapter;
                var num = loc.termNumber;
                if (typeof chapters[ch] === "undefined")
                {
                    chapters[ch] = {};
                    chapters[ch].ordinal = ch;
                    chapters[ch].cards = [];
                }
                chapters[ch].cards[num] = card;
            }
        }
        cache[bookid].chapters = chapters;
        player.bookcb(cache[bookid]);
    }
    if (typeof cache[bookid].chapters === "undefined")
    {
        $.getJSON(SERVER_URI + bookid, "", cb);
    }
    else
    {
        player.bookcb(cache[bookid]);
    }
}

function getChapter(bookid, chapterNum)
{
    return cache[bookid].chapters[chapterNum];
}

const lib = {};
lib.getIndex = getIndex;
lib.getBook = getBook;
lib.getChapter = getChapter;
export default lib;