const chapters = {};

function add(chapterId, cards)
{
    chapters[chapterId] = cards;
}

function remove(chapterId)
{
    delete chapters[chapterId];
}

function getCards()
{
    return Object.values(chapters);
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