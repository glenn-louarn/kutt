import React, { FC, useState, useEffect } from "react";

import { useMessage, useTheme } from "../../../hooks";
import { removeProtocol,  errorMessage } from "../../../utils";
import { useStoreActions, useStoreState } from "../../../store";
import { Link as LinkType } from "../../../store/links";
import {   Select } from "../../Input";
import Text, { H2, Span } from "../../Text";
import Modal from "../../Modal";
import { useTranslation } from 'react-i18next';
import { Flex } from "reflexbox";
import { Button } from "../../Button";
import Icon from "../../Icon";


type Props = {
  link: LinkType;
  showModal: boolean;
  setModal: Function;
}
const LinkTransfertModal = ({
  link,
  showModal,
  setModal//TODO revoir le nom
}: Props) => {
  const { getAll } = useStoreActions(s => s.users);
  const { submit } = useStoreActions(s => s.linkTransferts);
  const [loading, setLoading] = useState(false);
  const users = useStoreState(s => s.users);
  const [receiver, setReceiver] = useState(0);
  // const [message, setMessage] = useState("");
  const [message, setMessage] = useMessage();

  const theme = useTheme()
  const { t } = useTranslation();

  useEffect(() => {
    if (showModal) {
      getAll({ skip: "0", limit: "10" });
    }
    else {
      setReceiver(0)
      setMessage()
    }
  }, [showModal])

  const onTransfert = async () => {
    setLoading(true);
    try {
      const res = await submit({ type: "give",receiver_id: receiver, link_id: link.id })
      setMessage(res.message, "green");
      setTimeout(() => {
        setModal(false)
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
      closeHandler={() => setModal(false)}
    >
      {link && (
        <>
          <H2 mb={14} textAlign="center" bold>
            Change ownership
        </H2>
          <Text textAlign="center">Choose the new owner of this links :
          <Span bold>{" "}"{removeProtocol(link.link)}"</Span>?
          </Text>
          <Flex justifyContent="center" mt={20}>
          <Select
            justifyContent="center"
            pl={[3, 24]}
            pr={[3, 24]}
            fontSize={[14, 15]}
            height={[32, 37]}
            width={[180, 220]}
            onChange={(event) => setReceiver(parseInt(event.target.value, 10))}
            options={users.items.map(d => ({
              value: d.id,
              key: d.email
            }))}
            value={receiver + ""}/>
            </Flex>
          <Flex justifyContent="center" mt={25}>
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
                      onClick={() => setModal(false)}
                    >
                      {t('button.cancel')}
                    </Button>
                    <Button color="warning" ml={3} onClick={onTransfert}>
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
export default LinkTransfertModal;