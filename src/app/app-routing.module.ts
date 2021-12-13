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
import { DescriptionAttributesComponent } from './inventory/description-attributes/description-attributes.component';
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
import { PersonnelRegisterComponent } from './human-resource/personnel-register/personnel-register.component';

const routes: Routes = [
  {path: 'home', component: DashboardComponent, canActivate: [AuthGuard]},
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
  {path: 'customer-returns', component: CustomerReturnComponent, canActivate: [AuthGuard]},
  {path: 'customer-claims', component: CustomerClaimComponent, canActivate: [AuthGuard]},
  {path: 'return-to-vendor', component: ReturnToVendorComponent, canActivate: [AuthGuard]},
  {path: 'vendor-cr-note', component: VendorCreditNoteComponent, canActivate: [AuthGuard]},
  {path: 'customer-cr-note', component: CustomerCreditNoteComponent, canActivate: [AuthGuard]},
  {path: 'supplier-master', component: SupplierMasterComponent, canActivate: [AuthGuard]},
  {path: 'customer-master', component: CustomerMasterComponent, canActivate: [AuthGuard]},
  {path: 'personnel-register', component: PersonnelRegisterComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
