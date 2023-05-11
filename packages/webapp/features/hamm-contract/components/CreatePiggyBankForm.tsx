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
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContractAddress } from "../hooks";
import { z } from "zod";
import { Address, useAccount } from "wagmi";
import { ethers } from "ethers";
import { MyAddressInput } from "./MyAddressInput";

const EthAddress = z.preprocess(
  String,
  z.custom<Address>((data) => ethers.utils.isAddress(data as string))
);

const CreatePiggyBankSchema = z.object({
  beneficiaryAddress: EthAddress,
  withdrawerAddress: EthAddress,
  name: z.string(),
  description: z.string(),
  tokenContractAddress: EthAddress,
});

type FormValues = z.infer<typeof CreatePiggyBankSchema>;

export const CreatePiggyBankForm = () => {
  const contractAddress = useContractAddress();
  const { writeAsync: createPiggyBank } = useHammCreateNewPiggyBank({
    address: contractAddress,
  });
  const { address } = useAccount();
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
      withdrawerAddress: address,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const {
      beneficiaryAddress,
      withdrawerAddress,
      name,
      description,
      tokenContractAddress,
    } = values;
    return createPiggyBank({
      args: [
        beneficiaryAddress,
        withdrawerAddress,
        name,
        description,
        tokenContractAddress,
      ],
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
        <FormControl isInvalid={errors.withdrawerAddress !== undefined}>
          <FormLabel htmlFor="withdrawerAddress">Withdrawer Address</FormLabel>
          <Controller
            control={control}
            name="withdrawerAddress"
            render={({ field }) => (
              <MyAddressInput
                id="withdrawerAddress"
                size={"xs"}
                {...field}
                changeValue={(address) =>
                  setValue("withdrawerAddress", address)
                }
              />
            )}
          />
          <FormHelperText>
            Address that can{" "}
            <Text as={"span"} fontWeight={"bold"}>
              trigger
            </Text>{" "}
            the withdraw
          </FormHelperText>
          <FormErrorMessage>
            {errors.withdrawerAddress?.message}
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
