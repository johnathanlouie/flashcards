import playlist from "./playlist.js";
import queue from "./queue.js";
import lib from "./lib.js";

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
    loadCardInfo(queue.get());
}

// not all fields are guaranteed, need handle
function loadCardInfo(word)
{
    if (word)
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
    }
    else
    {
        $(card.all).text("Out of cards");
    }
}

// what if queue isnt empty
function next()
{
    if (!playlist.isEmpty())
    {
        if (!queue.hasNext())
        {
            var cards = playlist.getCards();
            if ($(randomCheckbox).prop("checked"))
            {
                cards = _.shuffle(cards);
            }
            queue.addCards(cards);
            //queue.print();// diagnostic
        }
        queue.next();
        changeCard();
    }
    else
    {
        // alert user is empty
        console.log("playlist empty");
    }
}

function prev()
{
    if (queue.hasPrev())
    {
        queue.prev();
        changeCard();
    }
    else
    {
        // what if empty
    }
}

function remove()
{

}

function reveal()
{
    $(card.all).removeClass("hidden");
}

function indexcb(error, index)
{
    var libContainer = "#library-container";
    $(libContainer).empty();
    for (let book of index)
    {
        let chaptersDiv = $("<div>").attr("class", "jl-container-flex-1");
        function bookcb(error, chapters)
        {
            for (let chapter of chapters)
            {
                var container = $("<div>").appendTo(chaptersDiv).attr("class", "jl-container-checkbox-1");
                let checkbox = $("<input>").appendTo(container);
                function chapterChange()
                {
                    function cb(error, cards)
                    {
                        playlist.add(chapter._id, cards);
                        $("#startpage-startbutton").toggleClass("ui-disabled", playlist.isEmpty());
                    }
                    if (checkbox.prop("checked"))
                    {
                        lib.getChapter(chapter._id, cb);
                    }
                    else
                    {
                        playlist.remove(chapter._id);
                        $("#startpage-startbutton").toggleClass("ui-disabled", playlist.isEmpty());
                    }
                }
                checkbox.attr("id", `checkbox-${chapter._id}`).attr("data-role", "none").attr("type", "checkbox").change(chapterChange);
                $("<label>").appendTo(container).attr("for", `checkbox-${chapter._id}`).text(chapter.ordinal);
            }
        }
        var bookDiv = $("<div>").appendTo(libContainer).attr("data-role", "collapsible");
        $("<h3>").appendTo(bookDiv).prop("onclick", () => lib.getBook(book._id, bookcb)).text(book.title);
        chaptersDiv.appendTo(bookDiv);
    }
    $(libContainer).enhanceWithin();
}

function keydown(eventObject)
{
    switch (eventObject.key)
    {
        case "ArrowLeft":
            prev();
            break;
        case "ArrowRight":
            next();
            break;
        case "ArrowUp":
            remove();
            break;
        case "ArrowDown":
            reveal();
            break;
    }
}

$("#button-prev").click(prev);
$("#button-next").click(next);
$("#button-remove").click(remove);
$("#button-reveal").click(reveal);
$("#startpage-startbutton").click(next);

$(document).on("pagecreate", "#page-library", () => lib.getIndex(indexcb));
$(document).keydown(keydown);