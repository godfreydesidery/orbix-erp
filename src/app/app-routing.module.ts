import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './authGuard';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { ClassComponent } from './inventory/class/class.component';
import { DepartmentComponent } from './inventory/department/department.component';
import { CategoryComponent } from './inventory/category/category.component';
import { MaterialInquiryComponent } from './inventory/material-inquiry/material-inquiry.component';
import { MaterialMasterComponent } from './inventory/material-master/material-master.component';
import { SubCategoryComponent } from './inventory/sub-category/sub-category.component';
import { ProductInquiryComponent } from './inventory/product-inquiry/product-inquiry.component';
import { ProductMasterComponent } from './inventory/product-master/product-master.component';
import { SubClassComponent } from './inventory/sub-class/sub-class.component';
import { LoginComponent } from './login/login.component';
import { AccessContolComponent } from './user/access-contol/access-contol.component';
import { RoleManagerComponent } from './user/role-manager/role-manager.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { BiometricsComponent } from './user/biometrics/biometrics.component';
import { TillAdministrationComponent } from './till/till-administration/till-administration.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { ProductMassManagerComponent } from './inventory/product-mass-manager/product-mass-manager.component';
import { MaterialMassManagerComponent } from './inventory/material-mass-manager/material-mass-manager.component';
import { WebPosComponent } from './web-pos/web-pos.component';
import { SalesReportsSubMenuComponent } from './reports/sales-reports-sub-menu/sales-reports-sub-menu.component';
import { InventoryReportsSubMenuComponent } from './reports/inventory-reports-sub-menu/inventory-reports-sub-menu.component';
import { ProductionReportsSubMenuComponent } from './reports/production-reports-sub-menu/production-reports-sub-menu.component';
import { LpoComponent } from './mechandizer/lpo/lpo.component';
import { GrnComponent } from './mechandizer/grn/grn.component';
import { QuotationComponent } from './mechandizer/quotation/quotation.component';
import { SalesInvoiceComponent } from './mechandizer/sales-invoice/sales-invoice.component';
import { SalesReceiptComponent } from './mechandizer/sales-receipt/sales-receipt.component';
import { AllocationComponent } from './mechandizer/allocation/allocation.component';
import { SalesLedgeComponent } from './mechandizer/sales-ledge/sales-ledge.component';
import { SalesJournalComponent } from './mechandizer/sales-journal/sales-journal.component';
import { BillReprintComponent } from './mechandizer/bill-reprint/bill-reprint.component';
import { PackingListComponent } from './mechandizer/packing-list/packing-list.component';
import { CustomerReturnComponent } from './mechandizer/customer-return/customer-return.component';
import { CustomerClaimComponent } from './mechandizer/customer-claim/customer-claim.component';
import { ReturnToVendorComponent } from './mechandizer/return-to-vendor/return-to-vendor.component';
import { VendorCreditNoteComponent } from './mechandizer/vendor-credit-note/vendor-credit-note.component';
import { CustomerCreditNoteComponent } from './mechandizer/customer-credit-note/customer-credit-note.component';
import { SupplierMasterComponent } from './supplier/supplier-master/supplier-master.component';
import { CustomerMasterComponent } from './customer/customer-master/customer-master.component';
import { EmployeeRegisterComponent } from './human-resource/employee-register/employee-register.component';
import { GroupLevel1Component } from './inventory/group-level1/group-level1.component';
import { GroupLevel2Component } from './inventory/group-level2/group-level2.component';
import { GroupLevel3Component } from './inventory/group-level3/group-level3.component';
import { GroupLevel4Component } from './inventory/group-level4/group-level4.component';
import { EndDayComponent } from './day/end-day/end-day.component';
import { CustomDateComponent } from './day/custom-date/custom-date.component';
import { BatchProductionComponent } from './production/batch-production/batch-production.component';
import { CustomProductionComponent } from './production/custom-production/custom-production.component';
import { MaterialToMaterialComponent } from './inventory/material-to-material/material-to-material.component';
import { MaterialToProductComponent } from './inventory/material-to-product/material-to-product.component';
import { ProductMaterialRatioComponent } from './inventory/product-material-ratio/product-material-ratio.component';
import { ProductToMaterialComponent } from './inventory/product-to-material/product-to-material.component';
import { ProductToProductComponent } from './inventory/product-to-product/product-to-product.component';
import { DebtReceiptComponent } from './mechandizer/debt-receipt/debt-receipt.component';
import { DebtAllocationComponent } from './mechandizer/debt-allocation/debt-allocation.component';
import { DailySalesReportComponent } from './reports/sales-reports/daily-sales-report/daily-sales-report.component';
import { ZHistoryComponent } from './reports/sales-reports/z-history/z-history.component';
import { ProductListingReportComponent } from './reports/sales-reports/product-listing-report/product-listing-report.component';
import { SupplySalesReportComponent } from './reports/sales-reports/supply-sales-report/supply-sales-report.component';
import { FastMovingItemsComponent } from './reports/sales-reports/fast-moving-items/fast-moving-items.component';
import { SlowMovingItemsComponent } from './reports/sales-reports/slow-moving-items/slow-moving-items.component';
import { ProductionReportComponent } from './reports/production-reports/production-report/production-report.component';
import { SalesListComponent } from './mechandizer/sales-list/sales-list.component';
import { StockCardReportComponent } from './reports/inventory-reports/stock-card-report/stock-card-report.component';

const routes: Routes = [
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'role-manager', component: RoleManagerComponent, canActivate: [AuthGuard]},
  {path: 'access-control', component: AccessContolComponent, canActivate: [AuthGuard]},
  {path: 'biometrics', component: BiometricsComponent, canActivate: [AuthGuard]},
  {path: 'till-administration', component: TillAdministrationComponent, canActivate: [AuthGuard]},
  {path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuard]},
  {path: 'product-master', component: ProductMasterComponent, canActivate: [AuthGuard]},
  {path: 'product-inquiry', component: ProductInquiryComponent, canActivate: [AuthGuard]},
  {path: 'department', component: DepartmentComponent, canActivate: [AuthGuard]},
  {path: 'class', component: ClassComponent, canActivate: [AuthGuard]},
  {path: 'sub-class', component: SubClassComponent, canActivate: [AuthGuard]},
  {path: 'material-master', component: MaterialMasterComponent, canActivate: [AuthGuard]},
  {path: 'material-inquiry', component: MaterialInquiryComponent, canActivate: [AuthGuard]},
  {path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'sub-category', component: SubCategoryComponent, canActivate: [AuthGuard]},
  {path: 'product-mass-manager', component: ProductMassManagerComponent, canActivate: [AuthGuard]},
  {path: 'material-mass-manager', component: MaterialMassManagerComponent, canActivate: [AuthGuard]},
  {path: 'web-pos', component: WebPosComponent, canActivate: [AuthGuard]},
  {path: 'sales-reports-sub-menu', component: SalesReportsSubMenuComponent, canActivate: [AuthGuard]},
  {path: 'inventory-reports-sub-menu', component: InventoryReportsSubMenuComponent, canActivate: [AuthGuard]},
  {path: 'production-reports-sub-menu', component: ProductionReportsSubMenuComponent, canActivate: [AuthGuard]},
  {path: 'lpo', component: LpoComponent, canActivate: [AuthGuard]},
  {path: 'grn', component: GrnComponent, canActivate: [AuthGuard]},
  {path: 'quotations', component: QuotationComponent, canActivate: [AuthGuard]},
  {path: 'sales-invoices', component: SalesInvoiceComponent, canActivate: [AuthGuard]},
  {path: 'sales-receipts', component: SalesReceiptComponent, canActivate: [AuthGuard]},
  {path: 'allocations', component: AllocationComponent, canActivate: [AuthGuard]},
  {path: 'sales-ledge', component: SalesLedgeComponent, canActivate: [AuthGuard]},
  {path: 'sales-journal', component: SalesJournalComponent, canActivate: [AuthGuard]},
  {path: 'bill-reprint', component: BillReprintComponent, canActivate: [AuthGuard]},
  {path: 'packing-list', component: PackingListComponent, canActivate: [AuthGuard]},
  {path: 'sales-list', component: SalesListComponent, canActivate: [AuthGuard]},
  {path: 'customer-returns', component: CustomerReturnComponent, canActivate: [AuthGuard]},
  {path: 'customer-claims', component: CustomerClaimComponent, canActivate: [AuthGuard]},
  {path: 'return-to-vendor', component: ReturnToVendorComponent, canActivate: [AuthGuard]},
  {path: 'vendor-cr-note', component: VendorCreditNoteComponent, canActivate: [AuthGuard]},
  {path: 'customer-cr-note', component: CustomerCreditNoteComponent, canActivate: [AuthGuard]},
  {path: 'supplier-master', component: SupplierMasterComponent, canActivate: [AuthGuard]},
  {path: 'customer-master', component: CustomerMasterComponent, canActivate: [AuthGuard]},
  {path: 'employee-register', component: EmployeeRegisterComponent, canActivate: [AuthGuard]},
  {path: 'group-level1', component: GroupLevel1Component, canActivate: [AuthGuard]},
  {path: 'group-level2', component: GroupLevel2Component, canActivate: [AuthGuard]},
  {path: 'group-level3', component: GroupLevel3Component, canActivate: [AuthGuard]},
  {path: 'group-level4', component: GroupLevel4Component, canActivate: [AuthGuard]},
  {path: 'end-day', component: EndDayComponent, canActivate: [AuthGuard]},
  {path: 'custom-date', component: CustomDateComponent, canActivate: [AuthGuard]},
  {path: 'batch-production', component: BatchProductionComponent, canActivate: [AuthGuard]},
  {path: 'custom-production', component: CustomProductionComponent, canActivate: [AuthGuard]},
  {path: 'product-material-ratio', component:ProductMaterialRatioComponent, canActivate: [AuthGuard]},
  {path: 'product-to-material', component:ProductToMaterialComponent, canActivate: [AuthGuard]},
  {path: 'material-to-product', component:MaterialToProductComponent, canActivate: [AuthGuard]},
  {path: 'product-to-product', component:ProductToProductComponent, canActivate: [AuthGuard]},
  {path: 'material-to-material', component:MaterialToMaterialComponent, canActivate: [AuthGuard]},
  {path: 'debt-receipts', component: DebtReceiptComponent, canActivate: [AuthGuard]},
  {path: 'debt-allocations', component: DebtAllocationComponent, canActivate: [AuthGuard]},
  {path: 'daily-sales-report', component: DailySalesReportComponent, canActivate: [AuthGuard]},
  {path: 'z-history', component: ZHistoryComponent, canActivate: [AuthGuard]},
  {path: 'product-listing-report', component: ProductListingReportComponent, canActivate: [AuthGuard]},
  {path: 'supply-sales-report', component: SupplySalesReportComponent, canActivate: [AuthGuard]},
  {path: 'fast-moving-items', component: FastMovingItemsComponent, canActivate: [AuthGuard]},
  {path: 'slow-moving-items', component: SlowMovingItemsComponent, canActivate: [AuthGuard]},
  {path: 'production-report', component: ProductionReportComponent, canActivate: [AuthGuard]},
  {path: 'stock-card-report', component: StockCardReportComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }