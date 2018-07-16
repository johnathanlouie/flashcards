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

function getCards()
{
    return Object.values(chapters).reduce(flatten);
}

function isEmpty()
{
    return Object.keys(chapters).length === 0;
}

const playlist = {};
playlist.add = add;
playlist.remove = remove;
playlist.getCards = getCards;
playlist.isEmpty = isEmpty;

export default playlist;