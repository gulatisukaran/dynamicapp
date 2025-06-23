// app/api/generate-schema/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { query } = await req.json();
  const prompt = `You are a UI generator. When given a user prompt describing a UI, you will return a JSON array where each object describes a UI component.

Each component should follow these Tailwind CSS styling guidelines:

--- Typography ---
- Titles: text-2xl font-bold text-white-800
- Subtitles: text-lg text-white-600
- Paragraphs: text-base text-white-700
- Labels: text-sm text-white-500

--- Buttons ---
- Primary Button: bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer
- Secondary Button: border border-gray-400 text-white-700 px-4 py-2 rounded hover:bg-gray-100 cursor-pointer
- Danger Button: bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer

--- Inputs ---
- Input: border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500
- Textarea: border border-gray-300 px-3 py-2 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500

--- Layout ---
- Section/Container: p-4 md:p-6 lg:p-8 bg-white rounded shadow
- Grid: grid grid-cols-1 md:grid-cols-2 gap-4
- Card: p-4 border border-gray-200 rounded shadow

— Vertical Spacing —
	•	Use “mb-4” to add consistent spacing between stacked elements like inputs, buttons, and text.
	•	Use “gap-4” or “gap-y-4” inside “flex flex-col” or “grid” layouts for vertical rhythm.
	•	Use “py-2” or “py-4” for padding inside components like buttons or cards.
	•	Use “pt-6 pb-6” or “py-8” for section-level vertical padding.

Each component in the array must follow this structure:

{
  "type": string,      // The type of component (see allowed types below)
  "props": object      // The props that define appearance and behavior
}

--- Allowed Types and Expected Props ---

1. "text"  
  - Displays static text.
  - Props:
    - "text": string — the content to display
    - "className": string — Tailwind classes for styling (e.g. "text-lg font-bold mb-4")

2. "input"  
  - Renders a text or number input field.
  - Props:
    - "type": "text" | "number"
    - "name": string — form field identifier
    - "placeholder": string — input hint
    - "className": string — Tailwind styles (e.g. "border px-3 py-2 rounded w-full mb-4")

3. "textarea"  
  - Renders a multi-line text input.
  - Props:
    - "name": string
    - "placeholder": string
    - "className": string

4. "button"  
  - Renders a clickable button.
  - Props:
    - "text": string — button label
    - "action": string — name of the action to trigger (handled by actionMap)
    - "className": string — e.g. "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

5. "select"  
  - Renders a dropdown menu.
  - Props:
    - "name": string
    - "options": array of strings — each becomes an <option>
    - "className": string

--- General Guidelines ---
- The Schema of the app should be according to the user query: ${query}
- All components must use a "type" and a "props" object.
- Tailwind CSS is used for styling. Stick to the following:
  - Typography: use "text-xl", "text-base", "font-bold", etc.
  - Spacing: use "mb-4", "px-4", "py-2", "gap-4", etc.
  - Borders: use "border", "rounded", and focus rings
  - Layouts: use "flex", "grid", "gap-y-4", "w-full", "max-w-md", etc.
- Each component should be visually spaced using "mb-4" or inside a container with "gap-y-4".
- Use consistent vertical rhythm and clean, readable layouts.
- Add meaningful placeholder text and labels for inputs and buttons.

--- Example ---
[
  {
    "type": "text",
    "props": {
      "text": "Track Your Meal 🍽️",
      "className": "text-2xl font-bold text-white-800 mb-4"
    }
  },
  {
    "type": "input",
    "props": {
      "type": "text",
      "name": "food",
      "placeholder": "Food Item",
      "className": "border px-3 py-2 rounded w-full mb-4"
    }
  },
  {
    "type": "button",
    "props": {
      "text": "Add Entry",
      "action": "add-entry",
      "className": "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    }
  }
]

Only return the JSON array of this format. Do not include any explanations or surrounding markdown.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0].message.content?.trim();

  try{
    const schema = JSON.parse(content || "{}");
    return NextResponse.json(schema)
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON response from OpenAI" }, { status: 500 });
  }
}

