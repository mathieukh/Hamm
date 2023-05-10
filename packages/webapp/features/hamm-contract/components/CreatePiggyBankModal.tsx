import { useHammCreateNewPiggyBank } from "@/lib/hamm";
import {
  DetailedHTMLProps,
  FC,
  HTMLProps,
  InputHTMLAttributes,
  useState,
} from "react";
import { Address } from "wagmi";
import { utils } from "ethers";
import { useContractAddress } from "../hooks";

const Input: FC<{
  label: string;
  inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}> = ({ label, inputProps }) => (
  <div className="form-control w-full max-w-xs">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <input
      type="text"
      className="input input-bordered w-full max-w-xs"
      placeholder="Type here"
      {...inputProps}
    />
  </div>
);

const AddressInput: FC<{
  label: string;
  onAddressChanged: (address: Address) => void;
}> = ({ label, onAddressChanged }) => (
  <Input
    label={label}
    inputProps={{
      onChange: (event) => {
        const address = utils.getAddress(event.target.value) as Address;
        onAddressChanged(address);
      },
    }}
  />
);

export const CreatePiggyBankModal: FC<HTMLProps<HTMLDivElement>> = (props) => {
  const contractAddress = useContractAddress();
  const { writeAsync: createPiggyBank } = useHammCreateNewPiggyBank({
    address: contractAddress,
  });
  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [tokenContractAddress, setTokenContractAddress] = useState<
    Address | undefined
  >();
  const [beneficiaryAddress, setBeneficiaryAddress] = useState<
    Address | undefined
  >();
  const [withdrawerAddress, setWithdrawerAddress] = useState<
    Address | undefined
  >();
  return (
    <>
      <input type="checkbox" id={props.id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={props.id}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Create a piggy bank</h3>
          <AddressInput
            label="Beneficiary"
            onAddressChanged={(address) => setBeneficiaryAddress(address)}
          />
          <AddressInput
            label="Withdrawer"
            onAddressChanged={(address) => setWithdrawerAddress(address)}
          />
          <Input
            label="Name"
            inputProps={{
              value: name,
              onChange: (event) => setName(event.target.value),
            }}
          />
          <Input
            label="Description"
            inputProps={{
              value: description,
              onChange: (event) => setDescription(event.target.value),
            }}
          />
          <Input
            label="Token contract address"
            inputProps={{
              value: tokenContractAddress,
              onChange: (event) => {
                const address = utils.getAddress(event.target.value) as Address;
                setTokenContractAddress(address);
              },
            }}
          />
          <div className="modal-action">
            <a
              onClick={() => {
                if (beneficiaryAddress === undefined) return;
                if (withdrawerAddress === undefined) return;
                if (name === undefined) return;
                if (description === undefined) return;
                if (tokenContractAddress === undefined) return;
                createPiggyBank({
                  args: [
                    beneficiaryAddress,
                    withdrawerAddress,
                    name,
                    description,
                    tokenContractAddress,
                  ],
                });
              }}
              className="btn"
            >
              Create
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
