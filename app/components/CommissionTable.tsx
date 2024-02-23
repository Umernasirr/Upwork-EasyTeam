import { ICommissionPlan, IProduct } from "@/types/models";
import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  useBreakpoints,
  Card,
  Button,
  Icon,
} from "@shopify/polaris";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { PersonIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/navigation";

import { useState, useCallback, useEffect } from "react";

interface IProps {
  products: IProduct[];
  commissionPlans: ICommissionPlan[];
}

export default function CommissionsTable({
  products,
  commissionPlans,
}: IProps) {
  const [includedProducts, setIncludedProducts] = useState<IProduct[]>([]);
  const [commisionPercentage, setCommisionPercentage] = useState(0);
  const [notIncludedProducts, setNotIncludedProducts] = useState<IProduct[]>(
    []
  );

  const router = useRouter();
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [itemStrings, setItemStrings] = useState(["Included", "Not Included"]);
  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {
      clearSelection();
    },
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value: string) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction: IndexFiltersProps["primaryAction"] =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined
  );
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const handleAccountStatusChange = useCallback(
    (value: string[]) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value: [number, number]) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value: string) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  useEffect(() => {
    const commissionPlanProducts = commissionPlans.map((commissionPlan) => {
      return commissionPlan.productId;
    });

    const includedProducts: IProduct[] = [];
    const notIncludedProducts: IProduct[] = [];

    products.forEach((product) => {
      if (commissionPlanProducts.includes(product.id)) {
        includedProducts.push(product);
      } else {
        notIncludedProducts.push(product);
      }
    });

    setIncludedProducts(includedProducts);
    setNotIncludedProducts(notIncludedProducts);
  }, [products, commissionPlans]);

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Enabled", value: "enabled" },
            { label: "Not invited", value: "not invited" },
            { label: "Invited", value: "invited" },
            { label: "Declined", value: "declined" },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const activeProducts =
    selected === 0 ? includedProducts : notIncludedProducts;

  const productRows = activeProducts.map((product) => {
    return {
      id: product.id.toString(),
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          {product.name}
        </Text>
      ),
      category: product.category,
      price: product.price,
      commissionRate:
        commissionPlans.find((item) => item.productId === product.id)
          ?.commissionRate ?? 0,
    };
  });

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(productRows);

  const handleCommissionChange = async (selectedResources: string[]) => {
    const commissionPlansToUpdate = commissionPlans.filter((item) =>
      selectedResources.includes(item.productId.toString())
    );

    const commissionPlansToUpdateIds = commissionPlansToUpdate.map(
      (item) => item.id
    );

    try {
      await fetch("http://localhost:3000/api/commissionPlans", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: commissionPlansToUpdateIds,
          commissionRate: commisionPercentage / 100,
        }),
      }).then((response) => response.json());

      router.refresh();
      clearSelection();
      setCommisionPercentage(0);
    } catch (e) {
      console.log(e, "e");
    }
  };

  const rowMarkup = productRows.map(
    ({ id, name, category, price, commissionRate }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Icon source={PersonIcon} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{category}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            ${price}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div className="w-1/2">
            <TextField
              label=""
              prefix="%"
              type="number"
              value={`${Math.floor(commissionRate * 100)}`}
              // onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <div className="m-2">
      <Card>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={productRows.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          pagination={{
            hasNext: true,
            onNext: () => {},
          }}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "" },
            { title: "Name" },
            { title: "Category" },
            { title: "Price", alignment: "end" },
            { title: "Commission" },
            // { title: "Price" },
          ]}
        >
          {rowMarkup}
        </IndexTable>

        {selected === 0 && selectedResources.length > 0 && (
          <div id="ending" key="ending">
            <div className="w-full ">
              <div className="inline-block p-2">
                <TextField
                  autoComplete="off"
                  label=""
                  prefix="%"
                  value={commisionPercentage.toString()}
                  min={0}
                  max={100}
                  type="number"
                  onChange={(val) => {
                    setCommisionPercentage(parseInt(val));
                  }}
                />
              </div>

              <Button
                onClick={() => {
                  handleCommissionChange(selectedResources);
                }}
              >
                Apply to selected products
              </Button>
              <Button>Remove from plan</Button>
              <Button
                onClick={() => {
                  clearSelection();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return (value as string[]).map((val) => `Customer ${val}`).join(", ");
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
