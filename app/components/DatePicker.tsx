import {
  BlockStack,
  Box,
  Card,
  DatePicker,
  Icon,
  Popover,
  TextField,
} from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";

import { CalendarIcon } from "@shopify/polaris-icons";

// This example is for guidance purposes. Copying it will come with caveats.
export default function DatePickerComponent({
  handleValueChange,
}: {
  handleValueChange: any;
}) {
  function nodeContainsDescendant(rootNode: any, descendant: any) {
    if (rootNode === descendant) {
      return true;
    }
    let parent = descendant.parentNode;
    while (parent != null) {
      if (parent === rootNode) {
        return true;
      }
      parent = parent.parentNode;
    }
    return false;
  }
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });
  const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);
  function isNodeWithinPopover(node: any) {
    return datePickerRef?.current
      ? nodeContainsDescendant(datePickerRef.current, node)
      : false;
  }
  function handleInputValueChange(e: any) {}
  function handleOnClose({ relatedTarget }: any) {
    setVisible(false);
  }
  function handleMonthChange(month: any, year: any) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }: any) {
    handleValueChange(newSelectedDate);

    setSelectedDate(newSelectedDate);
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);
  return (
    <BlockStack inlineAlign="stretch" gap="400">
      <Box minWidth="276px" padding={{ xs: "025" }}>
        <Popover
          active={visible}
          autofocusTarget="none"
          preferredAlignment="left"
          fullWidth
          preferInputActivator={false}
          preferredPosition="below"
          preventCloseOnChildOverlayClick
          onClose={handleOnClose}
          activator={
            <TextField
              role="combobox"
              label={"Order Date"}
              prefix={<Icon source={CalendarIcon} />}
              value={formattedValue}
              onFocus={() => setVisible(true)}
              onChange={handleInputValueChange}
              autoComplete="off"
            />
          }
        >
          {/* @ts-ignore */}
          <Card ref={datePickerRef}>
            <DatePicker
              month={month}
              year={year}
              selected={selectedDate}
              onMonthChange={handleMonthChange}
              onChange={handleDateSelection}
            />
          </Card>
        </Popover>
      </Box>
    </BlockStack>
  );
}
