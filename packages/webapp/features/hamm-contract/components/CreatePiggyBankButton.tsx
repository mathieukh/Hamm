import { FC, HTMLProps } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

const CreatePiggyBankModal: FC<HTMLProps<HTMLDivElement>> = (props) => (
  <div className="modal" {...props}>
    <div className="modal-box">
      <h3 className="font-bold text-lg">
        Congratulations random Internet user!
      </h3>
      <p className="py-4">Cool</p>
      <div className="modal-action">
        <a href="#" className="btn">
          Yay!
        </a>
      </div>
    </div>
  </div>
);

export const CreatePiggyBankButton: FC = () => (
  <>
    <a
      href="#create-piggy-modal"
      className="btn btn-sm btn-secondary btn-outline"
    >
      <PlusCircleIcon className="mr-1 h-5 w-5" aria-hidden="true" />
      <span className="capitalize">Create</span>
    </a>
    <CreatePiggyBankModal id="create-piggy-modal" />
  </>
);
