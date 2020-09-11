import React, { FC, useState, useEffect } from "react";

import { useMessage, useTheme } from "../../../hooks";
import { removeProtocol, withComma, errorMessage } from "../../../utils";
import { useStoreActions, useStoreState } from "../../../store";
import { Link as LinkType } from "../../../store/links";
import { Checkbox, TextInput, Select } from "../../Input";
import Text, { H2, Span } from "../../Text";
import Modal from "../../Modal";
import { useTranslation } from 'react-i18next';
import { show } from "react-tooltip";
import { Flex } from "reflexbox";
import { Button } from "../../Button";
import Icon from "../../Icon";


type Props = {
  link: LinkType;
  showModal: boolean;
  closeModal: Function;
}
const ChangeOwnerModal = ({
  link,
  showModal,
  closeModal
}: Props) => {
  const { getAll } = useStoreActions(s => s.users);
  const { submit } = useStoreActions(s => s.linkChangeOwners);
  const [loading, setLoading] = useState(false);
  const users = useStoreState(s => s.users);
  const [newOwner, setNewOwner] = useState(0);
  // const [message, setMessage] = useState("");
  const [message, setMessage] = useMessage();

  const theme = useTheme()
  const { t } = useTranslation();

  useEffect(() => {
    if (showModal) {
      getAll({ skip: "0", limit: "10" });
    }
  }, [showModal])

  const onChangeOwner = async () => {
    setLoading(true);
    try {
      const res = await submit({ newOwner: newOwner, link_id: link.id })
      setMessage(res.message, "green");
      setTimeout(() => {
        closeModal(false)
        // setBanModal(false);
      }, 1500);
    } catch (err) {
      setMessage(errorMessage(err));
    }
    setLoading(false);
  }

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
              onChange={(event) => { setNewOwner(parseInt(event.target.value, 10)); console.log("event.target =========++++++> ", event.target.value) }}
              options={users.items.map(d => ({
                value: d.id,
                key: d.email
              }))}
              value={newOwner + ""}></Select>
            {/* <TextInput placeholder="message..." onChange={(e) => setMessage(e.target.value)} value={message}></TextInput> */}
          </Text>
          <Flex justifyContent="center" mt={44}>
            {loading ? (
              <>
                <Icon name="spinner" size={20}
                  stroke={theme.component.spinner} />

              </>
            ) : message.text ? (
              <Text fontSize={15} color={message.color}>
                {message.text}
              </Text>
            ) : (
                  <>
                    <Button
                      color="default"
                      mr={3}
                      onClick={() => closeModal(-1)}
                    >
                      {t('button.cancel')}
                    </Button>
                    <Button color="warning" ml={3} onClick={onChangeOwner}>
                      Change owner
                    </Button>
                  </>
                )}
          </Flex>
        </>
      )}

    </Modal >
  )
}
export default ChangeOwnerModal;