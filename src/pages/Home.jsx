// import React from "react";
// import { useAuth } from "../context/AuthContext";

import { Box, Text, Card, CardBody, Stack, Container, Button, Flex } from "@chakra-ui/react";
import ActivityList from "../components/ActivityList";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, signout } = useAuth();
  return (
    <Stack w="full">
      <Flex
        w="full"
        h="fit-content"
        borderBottom="1px"
        borderColor="gray.700"
        pb="1"
        justifyContent={"center"}
        gap="1"
        alignItems={"center"}
      >
        <Text>Welcome, {user?.userData.firstname}</Text>
        <Button colorScheme="red" size="sm" onClick={() => signout()}>
          Sign Out
        </Button>
      </Flex>
      <ActivityList />
    </Stack>
  );
};

const ActivityCard = ({ activity }) => {
  const { distance, moving_time, elapsed_time, average_speed, start_date_local } = activity;

  // Convert speed (m/s) to min/km
  const pace = average_speed > 0 ? 1000 / average_speed / 60 : 0;
  const formattedPace = `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, "0")} min/km`;

  // Convert elapsed time to HH:MM:SS
  const formattedElapsedTime = new Date(elapsed_time * 1000).toISOString().substr(11, 8);

  // Format start date
  const startDate = new Date(start_date_local).toLocaleString();

  const isEligible = pace < 7 && distance > 3000;

  return (
    <Card borderRadius="lg" boxShadow="md" p={4} maxW="sm" bg="green.800" mb={1}>
      <CardBody>
        <Text fontSize="xl" fontWeight="bold">
          Activity Summary
        </Text>
        <Box mt={2}>
          <Text>
            <strong>Distance:</strong> {(distance / 1000).toFixed(2)} km
          </Text>
          <Text>
            <strong>Avg Pace:</strong> {formattedPace}
          </Text>
          <Text>
            <strong>Start Time:</strong> {startDate}
          </Text>
          <Text>
            <strong>Total Time:</strong> {formattedElapsedTime}
          </Text>
        </Box>
        {JSON.stringify(isEligible)}
      </CardBody>
    </Card>
  );
};

// export default ActivityCard;
export default Home;
