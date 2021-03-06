/* global _ */

import playlist from "./playlist.js";
import queue from "./queue.js";
import lib from "./lib.js";

let randomCheckbox = $("#settings-options-random");
let libContainer = $("#library-container");
let emptyPopup = $("#popup-empty");

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
    card.form.toggle(options.form.prop("checked"));
    card.pronunciation.toggle(options.pronunciation.prop("checked"));
    card.definition.toggle(options.definition.prop("checked"));
    loadCardInfo(queue.get());
}

function loadCardInfo(word)
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
    card.all.enhanceWithin();
}

function next()
{
    if (!queue.hasNext())
    {
        if (playlist.isEmpty())
        {
            emptyPopup.popup("open");
            return;
        }
        let cards = playlist.getCards();
        if (randomCheckbox.prop("checked"))
        {
            cards = _.shuffle(cards);
        }
        queue.addCards(cards);
    }
    queue.next();
    changeCard();
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
        emptyPopup.popup("open");
    }
}

function remove()
{
    let card = queue.get();
    if (card)
    {
        playlist.removeCard(card._id);
        next();
    }
}

function reveal()
{
    card.all.show();
}

function showLoader()
{
    $.mobile.loading("show", {
        textVisible: true,
        theme: "b"
    });
}

function hideLoader()
{
    $.mobile.loading("hide");
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
                        hideLoader();
                    }
                    $("#startpage-startbutton").addClass("ui-disabled");
                    if (checkbox.prop("checked"))
                    {
                        showLoader();
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
            hideLoader();
        }
        function loadBook()
        {
            showLoader();
            lib.getBook(book._id, listChapters);
        }
        header.text(book.title).one("click", loadBook);
        chaptersDiv.addClass("ui-grid-d");
        bookDiv.attr("data-role", "collapsible");
        bookDiv.append(header, chaptersDiv);
        libContainer.append(bookDiv);
    }
    libContainer.enhanceWithin();
    hideLoader();
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

function loadIndex()
{
    showLoader();
    lib.getIndex(listBooks);
}

$("#button-prev").click(prev);
$("#button-next").click(next);
$("#button-remove").click(remove);
$("#button-reveal").click(reveal);
$("#startpage-startbutton").click(next);
$("#page-library").one("pageshow", loadIndex);
$("#page-main").on("pageshow", () => $(document).keydown(keydown));
$("#page-main").on("pagehide", () => $(document).off("keydown", keydown));