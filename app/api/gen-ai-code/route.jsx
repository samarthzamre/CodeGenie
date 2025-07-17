// import { GenAiCode } from "@/configs/AIModel";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { prompt } = await req.json();

//   try {
//     const result = await GenAiCode.sendMessage(prompt);
//     const resp = await result.response.text();

//     return NextResponse.json(JSON.parse(resp));
//   } catch (e) {
//     console.error("AI code generation failed:", e);
//     return NextResponse.json(
//       { error: e.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/gen-ai-code/route.js
import { GenAiCode } from "@/configs/AIModel";
import { NextResponse } from "next/server";
import Lookup from "@/data/Lookup"; // fallback default files

export async function POST(req) {
  try {
    // 1) Parse the incoming JSON
    let prompt;
    try {
      const body = await req.json();
      prompt = body.prompt;
    } catch (e) {
      console.error("Failed to parse request JSON:", e);
      // Return fallback immediately
      return NextResponse.json(
        {
          files: Lookup.DEFAULT_FILE,
          error: "Invalid request body",
        },
        { status: 200 }
      );
    }

    // 2) Call the AI and parse its response
    let aiResponse;
    try {
      const result = await GenAiCode.sendMessage(prompt);
      const text = await result.response.text();
      aiResponse = JSON.parse(text);
    } catch (e) {
      console.error("AI code generation or parsing failed:", e);
      aiResponse = {
        // fallback simple file
        files: {
          "/App.js": {
            code: `// AI generation failed; showing fallback\nconsole.log("Please try again later.");`,
          },
        },
        error: "AI generation failed",
      };
    }

    // 3) Ensure `files` exists
    const files = aiResponse.files || {
      "/App.js": {
        code: `// No files returned; showing fallback\nconsole.log("Nothing to display.");`,
      },
    };

    // 4) Return the result (always with status 200)
    return NextResponse.json({ files, error: aiResponse.error || null }, { status: 200 });
  } catch (e) {
    // Catch anything unexpected
    console.error("Unexpected error in gen-ai-code route:", e);
    return NextResponse.json(
      {
        files: {
          "/App.js": {
            code: `// Unexpected server error; please try again.\nconsole.log("Error");`,
          },
        },
        error: "Unexpected server error",
      },
      { status: 200 }
    );
  }
}
