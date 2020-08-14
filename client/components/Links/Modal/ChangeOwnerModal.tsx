import React, { FC, useState, useEffect } from "react";

import { useTheme } from "../../../hooks";
import { removeProtocol, withComma, errorMessage } from "../../../utils";
import { useStoreActions, useStoreState } from "../../../store";
import { Link as LinkType } from "../../../store/links";
import { Checkbox, TextInput, Select } from "../../Input";
import Text, { H2, Span } from "../../Text";
import Modal from "../../Modal";
import { useTranslation } from 'react-i18next';
import { show } from "react-tooltip";


type Props = {
  link: LinkType;
  showModal: boolean;
  closeModal: Function;
}
const DeleteLink = ({
  link,
  showModal,
  closeModal
}: Props) => {
  const { getAll } = useStoreActions(s => s.users);
  const users = useStoreState(s => s.users);
  const [newOwner, setNewOwner] = useState("");

  const theme = useTheme()
  const { t } = useTranslation();

  useEffect( () => {
    if(showModal){
      getAll({ skip: "0", limit: "10"});
    }
  }, [showModal])

  return (
    <Modal
    id="change-ownership"
    show={showModal}
    closeHandler={() => closeModal(true)}
  >
    {link && (
      <>
        <H2 mb={24} textAlign="center" bold>
          Change ownership
        </H2>
        <Text textAlign="center">Choose the new owner of this links :
          <Span bold>{" "}"{removeProtocol(link.link)}"</Span>?
          <Select
              onChange= {(event) =>setNewOwner(event.target.value)} 
              options={ users.items.map(d => ({
                value: d.id,
                key: d.email
              }))}
              value={newOwner}></Select>
          <TextInput placeholder="message..."></TextInput>
        </Text>
      
      </>
    )}
  </Modal>
  )
}
export default DeleteLink;