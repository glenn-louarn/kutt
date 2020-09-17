
import React from "react";
import QRCode from "qrcode.react";

import { Link as LinkType } from "../../../store/links";
import Modal from "../../Modal";
import { RowCenter } from "../../Layout";

type Props = {
  link: LinkType;
  showModal: boolean;
  setModal: Function;
}

const QRCodeLink = ({
  link,
  showModal,
  setModal
}: Props) => {

  return (
    <Modal
      id="table-qrcode-modal"
      minWidth="max-content"
      show={showModal}
      closeHandler={() => setModal(false)}
    >
      <RowCenter width={192}>
        <QRCode size={192} value={link.link} />
      </RowCenter>
    </Modal>
  )
}
export default QRCodeLink;