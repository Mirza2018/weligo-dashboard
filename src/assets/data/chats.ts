export type ChatMessage = {
  id: string;
  fromMe: boolean;
  text?: string;
  time: string;
  attachment?: { name: string; size: string; ext: string };
  dayLabel?: string;
};

export type ChatThread = {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  messages: ChatMessage[];
};

const defaultMessages: ChatMessage[] = [
  { id: "1", fromMe: false, text: "Hello my dear sir, I'm here do deliver the design requirement document for our next projects.", time: "10:25", dayLabel: "19 August" },
  { id: "2", fromMe: false, time: "10:26", attachment: { name: "Design_project_2025.docx", size: "2,5gb", ext: "docx" } },
  { id: "3", fromMe: true, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labori", time: "11:25" },
  { id: "4", fromMe: false, text: "Do androids truly dream of electric sheeps?", time: "12:25", dayLabel: "Today" },
];

const names = [
  "Weligo Support",
  "Jerome White",
  "Madagascar Silver",
  "Pippins McGray",
  "McKinsey Vermillion",
  "Dorian F. Gray",
  "Benedict Combersmacks",
  "Kaori D. Miyazono",
  "Saylor Twift",
  "Miranda Blue",
  "Esmeralda Gray",
];

export const chatThreads: ChatThread[] = names.map((name, i) => ({
  id: `c${i + 1}`,
  name,
  handle: `@${name.toLowerCase().replace(/[^a-z]+/g, "_")}`,
  lastMessage: "Enter your message description here...",
  time: "12:25",
  unread: i === 2 ? 999 : i === 4 ? 8 : i === 5 ? 2 : 0,
  online: i % 2 === 0,
  messages: defaultMessages,
}));
