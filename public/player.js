/* global _ */

import playlist from "./playlist.js";
import queue from "./queue.js";
import lib from "./lib.js";

let randomCheckbox = $("#settings-options-random");
let libContainer = $("#library-container");

let card = {};
card.form = $("#card-form");
card.pronunciation = $("#card-pronunciation");
card.definition = $("#card-definition");
card.all = $(card.form.toArray().concat(card.pronunciation.toArray()).concat(card.definition.toArray()));

let options = {};
options.random = $("#settings-options-random");
options.form = $("#settings-options-term");
options.pronunciation = $("#settings-options-pronunciation");
options.definition = $("#settings-options-definition");

function changeCard()
{
    card.form.toggleClass("hidden", !options.form.prop("checked"));
    card.pronunciation.toggleClass("hidden", !options.pronunciation.prop("checked"));
    card.definition.toggleClass("hidden", !options.definition.prop("checked"));
    loadCardInfo(queue.get());
}

// not all fields are guaranteed, need handle
function loadCardInfo(word)
{
    if (word)
    {
        card.all.empty();
        for (let i of word.term)
        {
            for (let j of i.form)
            {
                card.form.append(j);
            }
            for (let j of i.pronunciation)
            {
                card.pronunciation.append(j);
            }
        }
        for (let i of word.definition)
        {
            let p = $("<p>");
            let div = $("<div>").addClass("partofspeech");
            let ol = $("<ol>").addClass("meaning");
            if (typeof i.partOfSpeech !== "undefined")
            {
                for (let j of i.partOfSpeech)
                {
                    div.text(j);
                }
            }
            for (let j of i.meaning)
            {
                $("<li>").text(j).appendTo(ol);
            }
            p.append(div, ol);
            card.definition.append(p);
        }
    }
    else
    {
        card.all.text("Out of cards");
    }
}

// what if queue isnt empty
function next()
{
    if (!playlist.isEmpty())
    {
        if (!queue.hasNext())
        {
            let cards = playlist.getCards();
            if (randomCheckbox.prop("checked"))
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
    card.all.removeClass("hidden");
}

function listBooks(error, index)
{
    libContainer.empty();
    for (let book of index)
    {
        let bookDiv = $("<div>");
        let header = $("<h3>");
        let chaptersDiv = $("<div>");
        function listChapters(error, chapters)
        {
            function makeCheckbox(chapter, index)
            {
                let cell = $("<div>");
                let checkbox = $("<input>");
                let label = $("<label>");
                function onCheckbox()
                {
                    function cb(error, cards)
                    {
                        playlist.add(chapter._id, cards);
                        $("#startpage-startbutton").toggleClass("ui-disabled", playlist.isEmpty());
                    }
                    $("#startpage-startbutton").addClass("ui-disabled");
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
                let checkboxId = `checkbox-${chapter._id}`;
                let checkboxAttr = {
                    "id": checkboxId,
                    "type": "checkbox",
                    "data-mini": "true"
                };
                checkbox.attr(checkboxAttr).change(onCheckbox);
                label.attr("for", checkboxId).text(chapter.ordinal);
                switch (index % 5)
                {
                    case 0:
                        cell.addClass("ui-block-a");
                        break;
                    case 1:
                        cell.addClass("ui-block-b");
                        break;
                    case 2:
                        cell.addClass("ui-block-c");
                    case 3:
                        cell.addClass("ui-block-d");
                    case 4:
                        cell.addClass("ui-block-e");
                        break;
                }
                cell.append(checkbox, label).appendTo(chaptersDiv);
            }
            chapters.forEach(makeCheckbox);
            libContainer.enhanceWithin();
        }
        header.text(book.title).click(() => lib.getBook(book._id, listChapters));
        chaptersDiv.addClass("ui-grid-d");
        bookDiv.attr("data-role", "collapsible");
        bookDiv.append(header, chaptersDiv);
        libContainer.append(bookDiv);
    }
    libContainer.enhanceWithin();
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

$(document).on("pagecreate", "#page-library", () => lib.getIndex(listBooks));
$(document).keydown(keydown);