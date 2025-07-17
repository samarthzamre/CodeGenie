const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export const GenAiCode=model.startChat({
   generationConfig:CodeGenerationConfig,
   history:[
    {
      role:"user",
      parts:[
         {
            text: "generate todo app : Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n"
          },
      ]
    },
    {
      role:"model",
      parts:[
        {
            text: "**Designing Project Structure**\n\nI've been mapping out the project structure, prioritizing a clean separation of concerns for the React todo app using Vite. I'm focusing on React, Tailwind CSS, and Lucide React. The JSON schema for the project structure is being finalized, ensuring clarity and ease of use.\n\n\n**Structuring the App's Layout**\n\nI'm structuring the app's components, focusing on React's reusability. I'm building `Header`, `Footer`, `TaskForm`, and `TaskList` components. Thinking about the state management and how to efficiently display/filter the tasks is my main focus. I'm considering using a context or a very simple state management solution, such as `useState`, if applicable.\n\n\n**Defining Key Features**\n\nNow, I'm focusing on the core functionality, like adding, editing, deleting, and filtering tasks, alongside persisting them using `localStorage`. Considering the task's data structure and filtering options is my priority. I'm aiming for concise, understandable components and functionalities.\n\n\n**Refining the UI/UX**\n\nI'm focused on the UI components, paying close attention to user interaction and visual flow, ensuring the app is both attractive and intuitive. I'm prioritizing accessibility and responsiveness. I'm designing with emojis for quick visual feedback and adding tooltips for clarity on icons and actions. I'm finalizing the file structure, ensuring everything is organized neatly.\n\n\n**Defining State and Logic**\n\nMy focus is now on the core logic and state management, I'm thinking about how the `TaskContext` will manage tasks and associated actions. I've designed the data structure for each task (title, due date, description, completed, and id). I'm also preparing to integrate `localStorage` to ensure persistence. I'm prioritizing efficient state updates. I also plan to add a filter functionality to streamline task management. Finally, I'm integrating the `react-chartjs-2` to illustrate the count of pending and completed tasks.\n\n\n**Outlining Project Files**\n\nNow, I'm focusing on defining the project's file structure, prioritizing the efficient utilization of Vite, React, Tailwind CSS, and other specified libraries. I'm finalizing the JSON structure for clarity and organization. I'm also planning to utilize the specified emojis for an intuitive user experience. Finally, I'm integrating a simple chart component using `react-chartjs-2`, aiming for a balance between functionality and a clean interface.\n\n\n"
          },
      ],
    },
   ],
})

// const result= await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
