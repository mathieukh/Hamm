import { useHammCreateNewPiggyBank } from "@/lib/hamm";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  FormHelperText,
  Textarea,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContractAddress } from "../hooks";
import { z } from "zod";
import { Address, useAccount, useNetwork } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers";
import { MyAddressInput } from "./MyAddressInput";
import { FC } from "react";
import { truncateAddress } from "@/utils";

const EthAddress = z.preprocess(
  String,
  z.custom<Address>((data) => ethers.utils.isAddress(data as string))
);

const CreatePiggyBankSchema = z.object({
  beneficiaryAddress: EthAddress,
  name: z.string(),
  description: z.string(),
  tokenContractAddress: EthAddress,
});

type FormValues = z.infer<typeof CreatePiggyBankSchema>;

export const CreatePiggyBankForm: FC<{
  onPiggyBankCreated: () => void;
}> = ({ onPiggyBankCreated }) => {
  const contractAddress = useContractAddress();
  const { writeAsync: createPiggyBank } = useHammCreateNewPiggyBank({
    address: contractAddress,
  });
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(CreatePiggyBankSchema),
    defaultValues: {
      beneficiaryAddress: address,
    },
  });
  const toast = useToast();
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const { beneficiaryAddress, name, description, tokenContractAddress } =
      values;
    return createPiggyBank({
      args: [beneficiaryAddress, name, description, tokenContractAddress],
    })
      .then(({ hash }) =>
        waitForTransaction({
          chainId: chain?.id,
          hash,
        }).then((transactionReceipt) => {
          if (transactionReceipt.status === "success") {
            toast({ status: "success", title: "Piggy bank created !" });
            onPiggyBankCreated();
          } else {
            toast({
              status: "error",
              title: "An error occurred",
              description: (
                <a
                  href={
                    new URL(
                      `/tx/${transactionReceipt.transactionHash}`,
                      chain?.blockExplorers?.default.url
                    ).href
                  }
                >
                  {truncateAddress(transactionReceipt.transactionHash)}
                </a>
              ),
            });
          }
          transactionReceipt.status;
        })
      )
      .catch(() => {
        toast({
          status: "error",
          title: "Oups",
          description: "Piggy bank has not been created",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl isInvalid={errors.name !== undefined}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input id="name" size={"xs"} {...register("name")} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description !== undefined}>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" {...register("description")} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.beneficiaryAddress !== undefined}>
          <FormLabel htmlFor="beneficiaryAddress">
            Beneficiary Address
          </FormLabel>
          <Controller
            control={control}
            name="beneficiaryAddress"
            render={({ field }) => (
              <MyAddressInput
                id="beneficiaryAddress"
                size={"xs"}
                {...field}
                changeValue={(address) =>
                  setValue("beneficiaryAddress", address)
                }
              />
            )}
          />
          <FormHelperText>
            Address that will{" "}
            <Text as={"span"} fontWeight={"bold"}>
              own
            </Text>{" "}
            the piggy bank
          </FormHelperText>
          <FormErrorMessage>
            {errors.beneficiaryAddress?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.tokenContractAddress !== undefined}>
          <FormLabel htmlFor="tokenContractAddress">
            ERC20 Token Address
          </FormLabel>
          <Input
            id="tokenContractAddress"
            size={"xs"}
            {...register("tokenContractAddress")}
          />
          <FormHelperText>
            ERC20 Token address that can{" "}
            <Text as={"span"} fontWeight={"bold"}>
              send
            </Text>{" "}
            in the piggy bank
          </FormHelperText>
          <FormErrorMessage>
            {errors.tokenContractAddress?.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>
      <Button mt={4} isLoading={isSubmitting} type="submit">
        Create
      </Button>
    </form>
  );
};
