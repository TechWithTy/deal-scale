/**
 * ! Static license data for products
 * * Contains definitions for all supported software licenses
 * @see {@link LicenseType} for available license types
 */

import { LicenseType, type TechLicense } from "@/types/products";

/**
 * Complete catalog of supported software licenses with their respective
 * permissions, conditions, and limitations.
 */
export const licenses: TechLicense[] = [
	{
		name: "MIT",
		type: LicenseType.MIT,
		url: "https://opensource.org/licenses/MIT",
		description:
			"A permissive open-source license with minimal restrictions. Allows commercial use, modification, distribution, and private use.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"private-use",
			"sublicense",
		],
		conditions: ["include-copyright", "include-license"],
		limitations: ["liability", "warranty"],
	},
	{
		name: "Apache 2.0",
		type: LicenseType.Apache_2_0,
		url: "https://www.apache.org/licenses/LICENSE-2.0",
		description:
			"A permissive open-source license that also provides an express grant of patent rights from contributors to users.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"patent-use",
			"private-use",
		],
		conditions: [
			"include-copyright",
			"include-license",
			"state-changes",
			"patent-notice",
		],
		limitations: ["trademark-use", "liability", "warranty"],
	},
	{
		name: "GNU GPLv3",
		type: LicenseType.GPL_3_0,
		url: "https://www.gnu.org/licenses/gpl-3.0",
		description:
			"A copyleft license that requires derived works to be open source and licensed under the same terms.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"patent-use",
			"private-use",
		],
		conditions: [
			"include-copyright",
			"disclose-source",
			"same-license",
			"state-changes",
			"document-changes",
		],
		limitations: ["liability", "warranty"],
	},
	{
		name: "BSD 2-Clause",
		type: LicenseType.BSD_2_Clause,
		url: "https://opensource.org/licenses/BSD-2-Clause",
		description:
			"A permissive license that comes in two variants, the 2-clause and 3-clause BSD license. This is the 2-clause version.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"private-use",
		],
		conditions: ["include-copyright"],
		limitations: ["liability", "warranty"],
	},
	{
		name: "BSD 3-Clause",
		type: LicenseType.BSD_3_Clause,
		url: "https://opensource.org/licenses/BSD-3-Clause",
		description:
			"A permissive license similar to the BSD 2-Clause License, but with a third clause that prohibits use of the copyright holder's name for promotion.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"private-use",
		],
		conditions: ["include-copyright", "non-endorsement"],
		limitations: ["liability", "warranty"],
	},
	{
		name: "Mozilla Public License 2.0",
		type: LicenseType.MPL_2_0,
		url: "https://www.mozilla.org/en-US/MPL/2.0/",
		description:
			"A weak copyleft license that allows linking with files under different licenses. Source code must be made available under MPL.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"patent-use",
			"private-use",
		],
		conditions: [
			"include-copyright",
			"disclose-source",
			"same-license",
			"document-changes",
		],
		limitations: ["liability", "warranty", "trademark-use"],
	},
	{
		name: "GNU LGPLv3",
		type: LicenseType.LGPL_3_0,
		url: "https://www.gnu.org/licenses/lgpl-3.0",
		description:
			"A weak copyleft license that allows linking with non-GPL programs, provided the LGPL-licensed components remain modifiable.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"patent-use",
			"private-use",
		],
		conditions: [
			"include-copyright",
			"disclose-source",
			"same-license",
			"document-changes",
			"library-usage",
		],
		limitations: ["liability", "warranty"],
	},
	{
		name: "Eclipse Public License 2.0",
		type: LicenseType.EPL_2_0,
		url: "https://www.eclipse.org/legal/epl-2.0/",
		description:
			"A business-friendly copyleft license that requires source code availability for modifications but allows combining with other code.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"patent-use",
			"private-use",
		],
		conditions: [
			"include-copyright",
			"disclose-source",
			"document-changes",
			"network-use-disclosure",
		],
		limitations: ["liability", "warranty", "patent-litigation"],
	},
	{
		name: "The Unlicense",
		type: LicenseType.Unlicense,
		url: "https://unlicense.org/",
		description:
			"A public domain dedication that allows anyone to use the code for any purpose with no restrictions.",
		permissions: [
			"commercial-use",
			"modification",
			"distribution",
			"private-use",
			"sublicense",
			"no-attribution",
		],
		conditions: [],
		limitations: ["liability", "warranty"],
	},
	{
		name: "Proprietary",
		type: LicenseType.Proprietary,
		url: "https://docs.nalpeiron.com/education-and-training/licensing-education/software-licensing-basics/what-is-a-proprietary-software-license",
		description:
			"All rights reserved. Use, modification, and distribution are subject to the terms and conditions specified in a separate agreement.",
		permissions: [],
		conditions: ["contact-owner"],
		limitations: [
			"no-commercial-use",
			"no-modification",
			"no-distribution",
			"no-sublicense",
			"no-reverse-engineering",
		],
	},
];
