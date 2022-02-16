var now = undefined;
var prev = [];
var next = [];

function get()
{
    return now;
}

function prev2()
{
    if (now !== undefined)
    {
        next.push(now);
    }
    now = prev.pop();
}

function next2()
{
    if (now !== undefined)
    {
        prev.push(now);
    }
    now = next.pop();
}

function hasNext()
{
    return next.length > 0;
}

function hasPrev()
{
    return prev.length > 0;
}

function addCards(cards)
{
    if (!Array.isArray(cards))
    {
        throw new Error("Not an array.");
    }
    next = next.concat(cards);
}

function clear()
{
    next = [];
}

const queue = {};
queue.get = get;
queue.prev = prev2;
queue.next = next2;
queue.hasNext = hasNext;
queue.hasPrev = hasPrev;
queue.addCards = addCards;
queue.clear = clear;

export default queue;