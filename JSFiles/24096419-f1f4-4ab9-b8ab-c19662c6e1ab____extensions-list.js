// all extensions
"use strict";

// all standard nav extensions
import { AllServicesExtension } from "./std-all-services/all-services-ext.js";
import { CreateNewExtension } from "./std-create-new/create-new-ext.js";
import { DashboardExtension } from "./std-dashboard/dashboard-ext.js";
import { HomePageExtension } from "./std-home/home-ext.js";

//	all browse style extensions
import { AllAppServicesExtension } from "./all-app-services/all-app-services.js";
import { AllResourceGroupsExtension } from "./all-resource-groups/all-resource-groups.js";
import { AllResourcesExtension } from "./all-resources/all-resources.js";
import { AllSqlDbsExtension } from "./all-sql-dbs/all-sql-dbs.js";
import { AllVmsExtension } from "./all-virtual-machines/all-virtual-machines.js";

// all one-off extensions
import { VirtualMachineExtension } from "./virtual-machine/vm-ext.js";
import { SqlServerExtension } from "./sql-server/sql-server.js";
import { MonitoringExtension } from "./monitor/monitor.js";
import { AzureActiveDirectoryExtension } from './azure-active-directory/azure-active-directory.js';

export const AllExtensionsList = [
	// all std
	AllServicesExtension,
	CreateNewExtension,
	HomePageExtension,
	DashboardExtension,

	// all browse
	AllAppServicesExtension,
	AllResourceGroupsExtension,
	AllResourcesExtension,
	AllSqlDbsExtension,
	AllVmsExtension,

	// all one-off
	VirtualMachineExtension,
	SqlServerExtension,
	MonitoringExtension,
	AzureActiveDirectoryExtension
];