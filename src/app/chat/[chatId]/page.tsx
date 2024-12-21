import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { chatId: string };
};

const ChatPage = async ({ params }: Props) => {
  // Use async/await to resolve params
  const chatId = params.chatId; // Directly access params.chatId (already resolved)

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch chats for the authenticated user
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats || _chats.length === 0) {
    return redirect("/");
  }

  // Validate chatId
  const parsedChatId = parseInt(chatId, 10);
  const currentChat = _chats.find((chat) => chat.id === parsedChatId);

  if (!currentChat) {
    return redirect("/");
  }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parsedChatId} />
        </div>
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parsedChatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
