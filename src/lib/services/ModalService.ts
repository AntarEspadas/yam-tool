import { type ModalSettings, type ModalStore } from "@skeletonlabs/skeleton"

export type AsyncModalSettings = Omit<Omit<ModalSettings, "response">, "type">

export type ModalType = ModalSettings["type"]

class ModalService {
  public showModal(
    type: "confirm",
    settings: AsyncModalSettings,
    modalStore: ModalStore
  ): Promise<boolean | undefined>
  public showModal(
    type: ModalType,
    settings: AsyncModalSettings,
    modalStore: ModalStore
  ): Promise<unknown> {
    return new Promise((resolve) => {
      modalStore.trigger({ ...settings, type, response: resolve })
    })
  }
}

export const modalService = new ModalService()
