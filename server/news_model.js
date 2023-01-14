const cohere = require('cohere-ai');
cohere.init(process.env.API_KEY);

const POSITIVE_EXAMPLES = [];
const NEGATIVE_EXAMPLES = [];

async function classifyNewsArticles(input) {
    const response = await cohere.classify({
        model: "medium",
        taskDescription: "",
        outputIndicator: "",
        inputs: input,
        examples: POSITIVE_EXAMPLES.map((positive) => ({text: positive, label: "positive"})).concat(
            NEGATIVE_EXAMPLES.map((negative) => ({text: negative, label: "negative"})))
    })

    return response.body.classifications[0];
}

module.exports = classifyNewsArticles;