const { CosmosClient } = require("@azure/cosmos");
const crypto = require("crypto");

const client = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
});

const container = client.database("kramDB").container("kramar");

module.exports = async function (context, req) {
    const message = req.body?.message?.trim() || "";
    if (message.length > 500) {
        context.res = { status: 400, body: "För långt meddelande." };
        return;
    }

    const id = crypto.randomBytes(4).toString("hex");
    const createdAt = new Date().toISOString();
    const ttl = 86400; // 24 timmar

    await container.items.create({ id, message, createdAt, ttl });

    context.res = {
        status: 200,
        body: { link: `https://enkram.se/${id}` },
    };
};
