import PopupWrapper from "./ui/PopupWrapper";
import { ArrowLeftStartOnRectangleIcon, BellSlashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./Modal/ConfirmModal";
import MenuItem from "./ui/MenuItem";

export default function ConversationMenu() {
   const [openModal, setOpenModal] = useState(false);

   // hooks

   const closeModal = () => setOpenModal(false);

   const classes = {
      icon: "w-[22px] mr-[5px]",
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <MenuItem cb={() => setOpenModal(true)}>
               <PlusIcon className={classes.icon} />
               Add memeber
            </MenuItem>
            <MenuItem cb={() => setOpenModal(true)}>
               <BellSlashIcon className={classes.icon} />
               Mute
            </MenuItem>
            <MenuItem cb={() => setOpenModal(true)}>
               <ArrowLeftStartOnRectangleIcon className={classes.icon} />
               Left
            </MenuItem>
         </PopupWrapper>

         {openModal && (
            <Modal close={closeModal}>
               <ConfirmModal callback={() => {}} close={closeModal} loading={false} />
            </Modal>
         )}
      </>
   );
}
