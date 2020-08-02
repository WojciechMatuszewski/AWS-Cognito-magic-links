import React from "react";
import {
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Flex,
  Heading,
  Button,
  FormControl,
  useToast,
  Text,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers";
import Auth from "@aws-amplify/auth";

type FormValues = {
  email: string;
};

const validationSchema = object().shape<FormValues>({
  email: string().email().required(),
});

function SignIn() {
  const [linkSent, setLinkSent] = React.useState(false);

  const toast = useToast();

  const { register, handleSubmit, errors, formState } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ email }: FormValues) {
    try {
      const user = await Auth.signIn(email);
      localStorage.setItem("session", user.Session);
      setLinkSent(true);
    } catch (e) {
      toast({
        title: "An error occurred",
        description:
          "Something went wrong, we were not able to send you the link",
        status: "error",
      });
    }
  }

  if (linkSent)
    return (
      <Flex
        direction="column"
        alignItems="center"
        height="100vh"
        justifyContent="center"
      >
        <Heading>Link sent!</Heading>
        <Text mt={4}>Check your inbox for instructions</Text>
      </Flex>
    );

  const { email: emailValidationError } = errors;

  return (
    <Flex
      direction="column"
      alignItems="center"
      height="100vh"
      justifyContent="center"
    >
      <Heading marginBottom="24px">Sign in</Heading>
      <form
        style={{ maxWidth: "600px", width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <Flex>
          <FormControl
            flex="1"
            isInvalid={formState.isDirty && Boolean(emailValidationError)}
          >
            <InputGroup>
              <InputLeftAddon>
                <Icon name="email" />
              </InputLeftAddon>
              <Input
                name="email"
                ref={register}
                type="email"
                placeholder="Your email"
                roundedLeft={0}
              />
            </InputGroup>
          </FormControl>
          <Button ml={4} type="submit" isLoading={formState.isSubmitting}>
            Get sign in link
          </Button>
        </Flex>
      </form>
    </Flex>
  );
}

export { SignIn };
