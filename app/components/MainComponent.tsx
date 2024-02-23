"use client";
import React from "react";

import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import CommissionTable from "./CommissionTable";
import { ICommissionPlan, IProduct, IStaffMember } from "@/types/models";
import Reports from "./Reports";

interface IProps {
  products: IProduct[];
  commissionPlans: ICommissionPlan[];
  staffMembers: IStaffMember[];
}
export async function MainComponent({
  products,
  commissionPlans,
  staffMembers,
}: IProps) {
  return (
    <AppProvider i18n={enTranslations}>
      <CommissionTable products={products} commissionPlans={commissionPlans} />
      <br />
      <Reports staffMembers={staffMembers} />
    </AppProvider>
  );
}

export default MainComponent;
