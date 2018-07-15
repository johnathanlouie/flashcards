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

export default queue;