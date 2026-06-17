import OpenAI from "openai";


// Using groq, cause i aint paying for no OpenAI api keys
// atleast while building
// export const client = new OpenAI({
//   apiKey: localStorage.getItem("llm-secret"),
//   baseURL: "https://api.groq.com/openai/v1",
//   dangerouslyAllowBrowser: true
// });

export const client = new OpenAI({
  apiKey: localStorage.getItem("llm-secret"),
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  dangerouslyAllowBrowser: true
});
