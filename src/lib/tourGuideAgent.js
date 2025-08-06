import OpenAI from "openai";

export async function askTourGuide(message, context = "") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  const openai = new OpenAI({ apiKey });

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `${context}\n\nUser asked: ${message}`,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.TOUR_ASSISTANT_ID,
  });

  let runStatus = run.status;
  while (runStatus !== "completed" && runStatus !== "failed") {
    const result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    runStatus = result.status;
    if (runStatus === "completed") break;
    await new Promise((res) => setTimeout(res, 1200));
  }

  if (runStatus !== "completed") {
    throw new Error("Assistant run failed");
  }

  const messages = await openai.beta.threads.messages.list(thread.id);
  return messages.data[0].content[0].text.value;
}
