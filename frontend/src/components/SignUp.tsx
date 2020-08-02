import React from "react";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { Auth } from "@aws-amplify/auth";

type FormValues = {
  email: string;
  password: string;
};

const validationSchema = object().shape<FormValues>({
  email: string().email().required(),
  password: string().min(6).required(),
});

function SignUp() {
  const toast = useToast();
  const { errors, formState, handleSubmit, register } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  async function onSubmit({ email, password }: FormValues) {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { name: email },
      });
      toast({
        title: "Signed up!",
        description: "Everything went fine",
      });
    } catch (e) {
      toast({
        title: "Something went wrong",
        description: e.message,
        status: "error",
      });
    }
  }

  const { email: emailErrors, password: passwordErrors } = errors;
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
        <Flex flexDir="column">
          <Stack spacing={4}>
            <FormControl
              flex="1"
              isInvalid={formState.isDirty && Boolean(emailErrors)}
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
            <FormControl
              flex="1"
              isInvalid={formState.isDirty && Boolean(passwordErrors)}
            >
              <InputGroup>
                <InputLeftAddon>
                  <Icon name="email" />
                </InputLeftAddon>
                <Input
                  name="password"
                  ref={register}
                  type="password"
                  placeholder="Your password"
                  roundedLeft={0}
                />
              </InputGroup>
            </FormControl>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Sign in
            </Button>
          </Stack>
        </Flex>
      </form>
    </Flex>
  );
}

export { SignUp };
