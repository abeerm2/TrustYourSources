const cohere = require('cohere-ai');
cohere.init(process.env.API_KEY);

const POSITIVE_EXAMPLES = ["war is good", "i stand with russia", "what russia is going to justify", "i support russia", "i support russia", "fire more missles", "war is the only way", "ukraine needs to just give up"];
const NEGATIVE_EXAMPLES = ["Pleases do not tell me that we do not have an obligation to stop this madness","Absolutely sickening Russian terrorism against the Ukrainian city Dnipro. We can stop this!", "Isn’t it hell on earth? ","This could have been prevented. It should have been prevented. Send Ukraine tanks, F-16s, ATACMS.", " russia is not only targeting Ukrainian civilians. It is also targeting the very principles of international law.", "There are moments in history when equivocating won’t do. The war in #Ukraine is one such moment. ", "Blaming Ukraine for prolonging the war is incredibly stupid because the only country responsible for the war in Ukraine i"];

async function classifySocialMedia(input){
    const response = await cohere.classify({
        model: "medium",
        taskDescription: "",
        outputIndicator: "",
        inputs: [input],
        examples: POSITIVE_EXAMPLES.map((positive) => ({text: positive, label: "positive"})).concat(
            NEGATIVE_EXAMPLES.map((negative) => ({text: negative, label: "negative"})))
    })

    return response.body.classifications[0];
}

module.exports = classifySocialMedia;
