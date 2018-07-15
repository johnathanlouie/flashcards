var now = null;
var prev = [];
var next = [];

function getNow()
{
    return now;
}

function prev2()
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
}

function next2()
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
        throw new Error("queue add cards not an array");
    }
    next = next.concat(cards);
}

function clear()
{
    next = [];
}

// diagnostic function
function print()
{
    console.log("================now===================");
    console.log(now ? now.term[0].form[0] : undefined);
    console.log("================next==================");
    for (let i in next)
    {
        console.log(i + ": " + (next[i] ? next[i].term[0].form[0] : undefined));
    }
}

const queue = {};
queue.getNow = getNow;
queue.prev = prev2;
queue.next = next2;
queue.hasNext = hasNext;
queue.hasPrev = hasPrev;
queue.addCards = addCards;
queue.clear = clear;
queue.print = print;

export default queue;