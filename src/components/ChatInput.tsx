import { PaperAirplaneIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { ElementRef, FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import { useSocket } from "@/stores/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useMessageActions from "@/hooks/useMessageActions";
import useSendMessageToNewConversation from "@/hooks/useNewConversation";
import { useAuth } from "@/stores/AuthContext";
import useUploadImage from "@/hooks/useUploadImage";
import PreviewImageList from "./PreviewImagesList";
// import useMemberActions from "@/hooks/useMemberActions";

export default function ChatInput() {
   const [message, setMessage] = useState("");
   const imageInputRef = useRef<ElementRef<"input">>(null);

   //hooks
   const { auth } = useAuth();
   const { currentConversationInStore, tempImages } = useSelector(selectCurrentConversation);
   const { socket } = useSocket();
   const { sendMessage } = useMessageActions();
   const { handleInputChange, handleSendImage } = useUploadImage();

   const { sendMessageToNewConversation } = useSendMessageToNewConversation();

   const clear = () => setMessage("");

   // const handleTriggleSendImage = () => {
   //    const inputEle = e.target as HTMLInputElement & { files: FileList };
   //    const fileLists = inputEle.files;
   // };

   const handleSendMessage = async (type: "image" | "message" | "icon") => {
      try {
         console.log("check type", type);

         if (!socket || !auth) return;
         if (!currentConversationInStore) {
            return sendMessageToNewConversation(message);
         }

         switch (type) {
            case "image":
               const inputEle = imageInputRef.current;
               if (!inputEle) return;

               await handleSendImage(imageInputRef.current);
               break;
            case "message":
               const messageSchema: MessageSchema = {
                  conversation_id: currentConversationInStore.id,
                  content: message,
                  from_user_id: auth.id,
                  type: "text",
                  status: "sending",
               };
               return sendMessage(messageSchema, {});
            case "icon":
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         console.log("run finally");

         clear();
      }
   };

   const SendButton = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
      return (
         <Button
            className={`h-[34px] w-[34px] ml-[10px]`}
            variant={"push"}
            size={"clear"}
            colors="secondary"
            onClick={onClick}
         >
            {children}
         </Button>
      );
   };

   const renderSendButton = useMemo(() => {
      if (tempImages.length)
         return (
            <SendButton onClick={() => handleSendMessage("image")}>
               <PaperAirplaneIcon className="w-[20px]" />
            </SendButton>
         );

      if (message)
         return (
            <SendButton onClick={() => handleSendMessage("message")}>
               <PaperAirplaneIcon className="w-[20px]" />
            </SendButton>
         );

      return (
         <SendButton onClick={() => handleSendMessage("icon")}>
            <span>&#128075;</span>
         </SendButton>
      );
   }, [message, tempImages]);

   const classes = {
      container: "flex p-2 sm:p-4 border-t",
      button: "p-[4px]",
      inputContainer:
         "bg-[#f3f3f5] flex-grow ml-[10px] border-[2px] border-[#ccc] rounded-[16px] px-3",
      input: " h-[32px] bg-transparent w-full font-[500] text-[#1f1f1f]  outline-none",
   };

   return (
      <div className={`${classes.container} ${tempImages.length ? "items-end" : "items-center"}`}>
         <input
            ref={imageInputRef}
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/*"
            id="image-choose"
            className="hidden"
         />
         <Button variant={"push"} size={"clear"} colors="secondary">
            <label className="flex cursor-pointer p-[4px]" htmlFor="image-choose">
               <PhotoIcon className="w-[22px]" />
            </label>
         </Button>
         <div className="flex-grow flex">
            <div className={classes.inputContainer}>
               <PreviewImageList />

               <input
                  className={classes.input}
                  placeholder="Message..."
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
               />
            </div>
         </div>

         {renderSendButton}
      </div>
   );
}
