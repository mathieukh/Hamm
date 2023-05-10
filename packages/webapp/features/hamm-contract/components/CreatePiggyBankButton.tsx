import { FC } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { CreatePiggyBankModal } from "./CreatePiggyBankModal";

export const CreatePiggyBankButton: FC = () => (
  <>
    <label
      htmlFor="create-piggy-modal"
      className="btn btn-sm btn-secondary btn-outline"
    >
      <PlusCircleIcon className="mr-1 h-5 w-5" aria-hidden="true" />
      <span className="capitalize">Create</span>
    </label>
    <CreatePiggyBankModal id="create-piggy-modal" />
  </>
);
