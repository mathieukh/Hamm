import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Switch,
  useBoolean,
} from "@chakra-ui/react";
import { FC, useEffect, forwardRef, LegacyRef } from "react";
import { Address, useAccount } from "wagmi";

export const MyAddressInput: FC<
  InputProps & { changeValue: (address: Address) => void }
  // eslint-disable-next-line react/display-name
> = forwardRef(({ changeValue, ...props }, ref: LegacyRef<HTMLDivElement>) => {
  const { address } = useAccount();
  const [isMe, setFlag] = useBoolean(props.value === address);
  useEffect(() => {
    if (isMe) {
      changeValue(address!!);
    }
  }, [address, changeValue, isMe]);
  return (
    <Flex gap={2} alignItems={"center"} ref={ref}>
      <FormControl display="flex" alignItems={"center"} maxW={"max-content"}>
        <FormLabel htmlFor="me" mb="0">
          Me?
        </FormLabel>
        <Switch
          id="me"
          size={"sm"}
          isChecked={isMe}
          onChange={setFlag.toggle}
        />
      </FormControl>
      <Input {...props} flex="1" disabled={isMe} />
    </Flex>
  );
});
