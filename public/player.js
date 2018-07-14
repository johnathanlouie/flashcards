/* global jl */

var playlist = (function ()
{
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

    return playlist;
})();

var player = (function ()
{
    var player = {};
    var randomCheckbox = "#settings-options-random";

    var card = {};
    card.form = $("#card-form")[0];
    card.pronunciation = $("#card-pronunciation")[0];
    card.definition = $("#card-definition")[0];
    card.all = [card.form, card.pronunciation, card.definition];

    var options = {};
    options.random = $("#settings-options-random")[0];
    options.form = $("#settings-options-term")[0];
    options.pronunciation = $("#settings-options-pronunciation")[0];
    options.definition = $("#settings-options-definition")[0];

    function changeCard()
    {
        $(card.form).toggleClass("hidden", !options.form.checked);
        $(card.pronunciation).toggleClass("hidden", !options.pronunciation.checked);
        $(card.definition).toggleClass("hidden", !options.definition.checked);
        loadCardInfo(queue.getNow());
    }

// not all fields are guaranteed, need handle
    function loadCardInfo(word)
    {
        if (typeof word !== "undefined" && word !== null)
        {
            $(card.all).empty();
            for (var i of word.term)
            {
                for (var j of i.form)
                {
                    $(card.form).append(j);
                }
                for (var j of i.pronunciation)
                {
                    $(card.pronunciation).append(j);
                }
            }
            for (var i of word.definition)
            {
                var p = document.createElement("p");
                var div = document.createElement("div");
                var ol = document.createElement("ol");
                if (typeof i.partOfSpeech !== "undefined")
                {
                    for (var j of i.partOfSpeech)
                    {
                        $(div).append(j);
                    }
                }
                for (var j of i.meaning)
                {
                    $(ol).append("<li>" + j + "</li>");
                }
                $(card.definition).append(p);
                $(p).append(div);
                $(p).append(ol);
                $(div).addClass("partofspeech");
                $(ol).addClass("meaning");
            }
        } else
        {
            $(card.all).text("There are no cards selected.");
        }
    }

// what if queue isnt empty
    player.next = function ()
    {
        if (!playlist.isEmpty())
        {
            if (!queue.hasNext())
            {
                var cards = playlist.getCards();
                if ($(randomCheckbox).prop("checked"))
                {
                    jl.array.shuffle(cards);
                }
                queue.addCards(cards);
                //queue.print();// diagnostic
            }
            queue.next();
            changeCard();
        } else
        {
            // alert user is empty
            console.log("playlist empty");
        }
    };

    player.prev = function ()
    {
        if (queue.hasPrev())
        {
            queue.prev();
            changeCard();
        } else
        {
            // what if empty
        }
    };

    player.remove = function ()
    {};

    player.reveal = function ()
    {
        $(card.all).removeClass("hidden");
    };

    player.randomChange = function ()
    {};

    player.loadIndex = function ()
    {
        lib.getIndex();
    };

// <div data-role="collapsible">
// <h3 fc-bookid="${obj.id}" fc-booktitle="${obj.title}" onclick="player.loadBook($(this).attr('fc-bookid'));">${obj.title}</h3>
// <div id="book-chapter-container-${obj.id}" class="jl-container-flex-1"></div>
// </div>

    player.indexcb = function (index)
    {
        var libContainer = "#library-container";
        $(libContainer).empty();
        for (var obj of index)
        {
            if (typeof obj === "undefined")
            {
                continue; }
            var bookDiv = jl(libContainer).newChild("div").attr("data-role", "collapsible");
            bookDiv.newChild("h3").prop("onclick", function ()
            {
                player.loadBook(obj.id);
            }).val(obj.title);
            bookDiv.newChild("div").attr("id", `book-chapter-container-${obj.id}`).attr("class", "jl-container-flex-1");
        }
        $(libContainer).enhanceWithin();
    };

    player.loadBook = function (bookid)
    {
        lib.getBook(bookid);
    };

// <div class='jl-container-checkbox-1'>
// <input id="" data-role='none' type='checkbox'>
// <label for=""></label>
// </div>

    player.bookcb = function (bookObj)
    {
        var chaptersContainer = jl(`#book-chapter-container-${bookObj.id}`);
        for (var chapterObj of bookObj.chapters)
        {
            if (typeof chapterObj === "undefined")
            {
                continue; }
            var id = bookObj.id + "-" + chapterObj.ordinal;
            var container = chaptersContainer.newChild("div").attr("class", "jl-container-checkbox-1");
            container.newChild("input").attr("id", id).attr("data-role", "none").attr("type", "checkbox").prop("bookId", bookObj.id).prop("chapterNum", chapterObj.ordinal).prop("onchange", function ()
            {
                player.chapterChange(this.bookId, this.chapterNum);
            });
            container.newChild("label").attr("for", id).val(chapterObj.ordinal);
        }
    };

    player.chapterChange = function (bookId, chapterNum)
    {
        if ($("#" + bookId + "-" + chapterNum).prop("checked"))
        {
            var chapter = lib.getChapter(bookId, chapterNum);
            playlist.add(bookId, chapterNum, chapter.cards);
        } else
        {
            playlist.remove(bookId, chapterNum);
        }
        $("#startpage-startbutton").toggleClass("ui-disabled", playlist.isEmpty());
    };

    player.keydown = function (eventObject)
    {
        switch (eventObject.key)
        {
            case "ArrowLeft":
                player.prev();
                break;
            case "ArrowRight":
                player.next();
                break;
            case "ArrowUp":
                player.remove();
                break;
            case "ArrowDown":
                player.reveal();
                break;
        }
    };

    return player;
})();

var queue = (function ()
{
    var queue = {};
    var now = null;
    var prev = [];
    var next = [];

    queue.getNow = function ()
    {
        return now;
    };

    queue.prev = function ()
    {
        if (prev.length === 0)
        {
            throw new Error("queue prev array empty");
        }
        if (now !== null)
        {
            next.unshift(now);
        }
        now = prev.pop();
    };

    queue.next = function ()
    {
        if (next.length === 0)
        {
            throw new Error("queue next array empty");
        }
        if (now !== null)
        {
            prev.push(now);
        }
        now = next.shift();
    };

    queue.hasNext = function ()
    {
        return next.length > 0;
    };

    queue.hasPrev = function ()
    {
        return prev.length > 0;
    };

    queue.addCards = function (cards)
    {
        if (!Array.isArray(cards))
        {
            throw new Error("queue add cards not an array");
        }
        next = next.concat(cards);
    };

    queue.clear = function ()
    {
        next = [];
    };

// diagnostic function
    queue.print = function ()
    {
        console.log("================now===================");
        console.log(now ? now.term[0].form[0] : undefined);
        console.log("================next==================");
        for (let i in next)
        {
            console.log(i + ": " + (next[i] ? next[i].term[0].form[0] : undefined));
        }
    };

    return queue;
})();

var lib = (function ()
{
    var lib = {};
    var cache = null;
    var restServerUri = "http://db.fc.com/";

    lib.getIndex = function ()
    {
        if (cache === null)
        {
            $.getJSON(restServerUri, "", function (jsonObj, textStatus, jqXHR)
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
            $.getJSON(restServerUri + bookid, "", function (jsonObj, textStatus, jqXHR)
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

    return lib;
})();

$(document).on("pagecreate", "#page-library", player.loadIndex);
$(document).keydown(player.keydown);