import NotificationPopUp from "./NotificationPopUp"
import React, { useCallback, useEffect, useState} from "react";
import { useStoreActions, useStoreState } from "../store";
import { links } from "../store/links";


const RequestToLinkTransfert = () => {

  const linkTransferts = useStoreState(s => s.linkTransferts.items);
  const edit = useStoreActions(s => s.linkTransferts.edit);
  const [showModal , setShowModal] = useState(false)
  const getLinkTransfert = useStoreActions(s => s.linkTransferts.get);

  const onAccept = async ()  => {
    await edit({id: linkTransferts[0].id, status: "accept"})
    setShowModal(false)
    getLinkTransfert()
  }
  const onRefuse = async () => {
    await edit({id: linkTransferts[0].id, status: "refuse"})
    setShowModal(false)
    getLinkTransfert()    
  }
  
  useEffect(() => {
    if(linkTransferts && linkTransferts[0] && linkTransferts[0].status === "on_hold" ){
      setShowModal(true)
    }
  }, [linkTransferts])

  return (
    <>
      {linkTransferts && linkTransferts[0] !== undefined && linkTransferts[0].status === "on_hold" &&(
        < NotificationPopUp
          notificationText={linkTransferts[0].sender.email + " would like to give you ownership of the links " + linkTransferts[0].link.address}
          showModal={showModal}
          onAccept={onAccept}
          onRefuse={onRefuse}
        />
      )}
    </>
  )
}

export default RequestToLinkTransfert
