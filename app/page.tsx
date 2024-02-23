import "@shopify/polaris/build/esm/styles.css";
import MainComponent from "./components/MainComponent";
import { Page } from "@shopify/polaris";
import { ICommissionPlan, IProduct, IStaffMember } from "@/types/models";

export default async function Home() {
  const {
    products,
    totalProducts,
  }: { products: IProduct[]; totalProducts: number } = await fetch(
    "http://localhost:3000/api/products"
  ).then((response) => response.json());

  const commissionPlans: ICommissionPlan[] = await fetch(
    "http://localhost:3000/api/commissionPlans"
  ).then((response) => response.json());

  const staffMembers: IStaffMember[] = await fetch(
    "http://localhost:3000/api/staffMembers"
  ).then((response) => response.json());

  return (
    <main className="">
      <MainComponent
        products={products}
        commissionPlans={commissionPlans}
        staffMembers={staffMembers}
      />
    </main>
  );
}
