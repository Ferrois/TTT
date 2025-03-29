import {
  Accordion,
  useColorModeValue,
  Container,
  Box,
} from "@chakra-ui/react";

import { useAuth } from "../context/AuthContext";
import ActivityItem from "./ActivityItem";

export default function ActivityList() {
  const { user } = useAuth();
  return (
    <Box minH={"100vh"} align={"center"} justify={"center"} bg={useColorModeValue("gray.50", "gray.800")}>
        <Box color={"gray.500"} mb="2">Showing most recent 10 activities.</Box>
      <Container>
        <Accordion allowMultiple width="100%" maxW="lg" rounded="lg">
          {user ? user.userActivities.map((activity) => <ActivityItem activity={activity} />) : "Loading..."}
        </Accordion>
      </Container>
    </Box>
  );
}
