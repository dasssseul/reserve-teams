import ModalRoot, { ModalSurface } from './Modal';
import ModalFooter from './ModalFooter';

const Modal = Object.assign(ModalRoot, {
  Footer: ModalFooter,
  Surface: ModalSurface,
});

export { Modal, ModalFooter, ModalSurface };
export type {
  ModalProps,
  ModalFooterProps,
  ModalSurfaceProps,
  ModalSize,
  ModalFooterLayout,
} from './Modal.types';
