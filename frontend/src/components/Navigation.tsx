import React from "react";
import { Box, Button, Flex, MenuItem, Text } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useIsAuthenticated";

function Navigation() {
  const { loading, authenticated } = useIsAuthenticated();
  if (loading || authenticated) return null;

  return (
    <Box bg="teal.500">
      <Text color="white">
        <Link to="/sign-in">Sign in</Link>
      </Text>
      <Text color="white">
        <Link to="/sign-up">Sign up</Link>
      </Text>
    </Box>
  );
}

export { Navigation };
