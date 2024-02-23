import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
} from "@shopify/polaris";
import React from "react";

export default function ReportsTable({ totalByDate }: { totalByDate: any }) {
  const dateObjects: any[] = [];
  Object.entries(totalByDate).map(([date, total]) => {
    if ((total as number) > 0) {
      dateObjects.push({
        id: date,
        total: total,
        date: date,
      });
    }
  });

  const resourceName = {
    singular: "totalByDate",
    plural: "totalByDates",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(dateObjects);

  const rowMarkup = dateObjects.map(({ id, total, date }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{total}</IndexTable.Cell>
      <IndexTable.Cell>{date}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={dateObjects.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: "Order Id" },
          { title: "Total Commission" },
          { title: "Date" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </LegacyCard>
  );
}
