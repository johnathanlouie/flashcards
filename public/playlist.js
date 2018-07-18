const chapters = {};
function add(chapterId, cards)
{
    chapters[chapterId] = cards;
}

function remove(chapterId)
{
    delete chapters[chapterId];
}

function flatten(accumulator, currentValue)
{
    return accumulator.concat(currentValue);
}

function removeCard(cardId)
{
    function findCard(card)
    {
        return card._id === cardId;
    }
    for (let cards of Object.values(chapters))
    {
        let index = cards.findIndex(findCard);
        if (index !== -1)
        {
            cards.splice(index, 1);
        }
    }
}

function getCards()
{
    return Object.values(chapters).reduce(flatten);
}

function isEmpty()
{
    return getCards().length === 0;
}

const playlist = {};
playlist.add = add;
playlist.remove = remove;
playlist.getCards = getCards;
playlist.isEmpty = isEmpty;
playlist.removeCard = removeCard;

export default playlist;