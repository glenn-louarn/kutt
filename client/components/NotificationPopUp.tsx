import React from "react";
import { useTranslation } from 'react-i18next';
import { Flex } from "reflexbox/styled-components";

import { useTheme } from "../hooks";
import Modal from "./Modal";
import { H2 } from "./Text";
import { Button } from "./Button";

type Props = {
  notificationText: String;
  showModal: boolean;
  onRefuse: () => void;
  onAccept: () => void;
}
const NotificationPopUp = ({
  notificationText,
  showModal,
  onAccept,
  onRefuse
}: Props) => {

  return (
    <Modal
      id="notification-custom-domain"
      show={showModal}
    >
      <>
        <H2 mb={24} textAlign="center" bold>
          {notificationText}
        </H2>
        <Flex>
          <Button
            color="warning"
            mr={3}
            onClick={() => onRefuse()}
          >
            Refuser
          </Button>
          <Button color="primary" ml={3} onClick={() => onAccept()}>
            Accepter
          </Button>

        </Flex>
      </>
    </Modal>
  )
}
export default NotificationPopUp;