import player from "./player.js";
var lib = {};
var cache = null;
const SERVER_URI = "library";

lib.getIndex = function ()
{
    if (cache === null)
    {
        $.getJSON(SERVER_URI, "", function (jsonObj, textStatus, jqXHR)
        {
            cache = [];
            for (let book of jsonObj)
            {
                cache[book.id] = book;
            }
            player.indexcb(cache);
        });
    } else
    {
        player.indexcb(cache);
    }
};

lib.getBook = function (bookid)
{
    if (typeof cache[bookid].chapters === "undefined")
    {
        $.getJSON(SERVER_URI + bookid, "", function (jsonObj, textStatus, jqXHR)
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
        });
    } else
    {
        player.bookcb(cache[bookid]);
    }
};

lib.getChapter = function (bookid, chapterNum)
{
    return cache[bookid].chapters[chapterNum];
};

lib.p = function ()
{
    a = cache[13].chapters[1].cards;
};

export default lib;