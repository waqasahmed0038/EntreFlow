import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/router";
import VendorNavbar from "../components/VendorNavbar";
import style from "../styles/vendor.module.css";
import Link from "next/link";

function VendorCustomerDashboard() {
  const isVendor = useSelector((state: RootState) => state.auth.vendor);
  const router = useRouter();

  useEffect(() => {
    // if(!isVendor){
    //     router.push("/")
    // }
  }, []);
  return (
    <>
      <VendorNavbar />

      <div className="container mt-5">
        <div className="row mt-4">
          <div className="col-md-6 col-lg-4 ">
            <Link href={"VendorDeliveryPartnerDetail"}>
              <div
                className={`
                ${style.card} card mb-4 text-center p-5  shadow-sm
                    `}
              >
                <p>info</p>
              </div>
            </Link>
          </div>
         
          <div className="col-md-6 col-lg-4 ">
            <Link href={"VendorDeliveryPartnerOrders"}>
              <div
                className={`
    ${style.card} card mb-4 text-center p-5  shadow-sm
        `}
              >
                <p> Delivered Orders</p>
              </div>
            </Link>
          </div>
         
        </div>

        <div className="row mt-4"></div>
      </div>
    </>
  );
}

export default VendorCustomerDashboard;
