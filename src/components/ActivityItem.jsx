import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
  useColorModeValue,
  Text,
  Container,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { ChevronDownIcon } from "@chakra-ui/icons";

const ActivityItem = ({ activity }) => {
  const { distance, moving_time, elapsed_time, average_speed, start_date_local, name } = activity;

  // Convert speed (m/s) to min/km
  const pace = average_speed > 0 ? 1000 / average_speed / 60 : 0;
  const formattedPace = `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, "0")} min/km`;

  // Convert elapsed time to HH:MM:SS
  const formattedElapsedTime = new Date(elapsed_time * 1000).toISOString().substr(11, 8);

  // Format start date
  const startDate = new Date(start_date_local).toLocaleString();

  const isEligible = pace < 7 && distance > 3000;
  
  

  return (
    <AccordionItem>
      <AccordionButton display="flex" alignItems="center" justifyContent="space-between" p={4}>
        {isEligible ? (
          <Badge variant="solid" colorScheme="green" align="flex-start" display="flex" alignItems="center" mr="2">
            <TiTick />
            Eligible
          </Badge>
        ) : (
          <Badge variant="solid" colorScheme="red" align="flex-start" display="flex" alignItems="center" mr="2" gap="1">
            <ImCross/>
            Not Eligible
          </Badge>
        )}
        <Text fontSize="md">{name}</Text>
        <ChevronDownIcon fontSize="24px" />
      </AccordionButton>
      <AccordionPanel pb={4}>
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
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ActivityItem;
