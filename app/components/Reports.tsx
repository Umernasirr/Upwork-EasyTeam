import { Box, Button, Card, Select } from "@shopify/polaris";
import DatePicker from "./DatePicker";

import { useState, useCallback } from "react";
import {
  ICommissionPlan,
  IOrder,
  IOrderItem,
  IProduct,
  IStaffMember,
} from "@/types/models";
import ReportsTable from "./ReportsTable";

interface IProps {
  staffMembers: IStaffMember[];
}

export default function Reports({ staffMembers }: IProps) {
  const [selectedId, setSelectedId] = useState(
    staffMembers ? staffMembers[0]?.id.toString() : ""
  );
  const [dateRange, setDateRange] = useState("");
  const [showReports, setShowReports] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalByDate, setTotalByDate] = useState<any>();
  const handleSelectChange = useCallback(
    (value: string) => setSelectedId(value),
    []
  );

  const staffMemberOptions = staffMembers.map((item) => {
    return { label: item.name, value: item.id.toString() };
  });

  const handleSimulate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/simulate?dateRange=${dateRange}&staffMemberId=${selectedId}`
      ).then((response) => response.json());

      const { ordersWithDetails, commissionPlan } = res;

      // Initialize an object to store total commission per day
      const totalsByDate: {
        [key: string]: number;
      } = {};

      ordersWithDetails.forEach((order: IOrder) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
        const orderItems = order.items;

        const orderTotal = orderItems.reduce((total: any, item: IOrderItem) => {
          const commission = commissionPlan.find(
            (plan: ICommissionPlan) => plan.productId === item.productId
          );

          if (commission) {
            return (
              total +
              item.product.price * commission.commissionRate * item.quantity
            ); // Also consider the quantity of each product
          }

          return total;
        }, 0);

        // Add the order total to the correct date in 'totalsByDate'
        if (totalsByDate[orderDate]) {
          totalsByDate[orderDate] += orderTotal;
        } else {
          totalsByDate[orderDate] = orderTotal;
        }

        const total = Object.values(totalsByDate).reduce(
          // Calculate the total commission
          (total, value) => total + value,
          0
        );
        setTotalByDate(totalsByDate);
        setTotal(total);
        setShowReports(true);
      });
    } catch (e) {
      console.error(e, "error");
    }
  };

  return (
    <Card>
      <Box>
        <h1>Reports</h1>
        <div className="gap-2 flex flex-col">
          <div className="w-1/2 mx-auto">
            <DatePicker handleValueChange={setDateRange} />
          </div>
          <div className="w-1/2 mx-auto">
            <Select
              label=""
              options={staffMemberOptions}
              onChange={handleSelectChange}
              value={selectedId}
            />
          </div>
          <div className="w-1/2 mx-auto">
            <Button
              size="slim"
              onClick={() => {
                handleSimulate();
              }}
            >
              Simulate
            </Button>
          </div>

          {showReports && <ReportsTable totalByDate={totalByDate} />}

          <h1>Total Commission Earnings: ${total}</h1>
        </div>
      </Box>
    </Card>
  );
}
