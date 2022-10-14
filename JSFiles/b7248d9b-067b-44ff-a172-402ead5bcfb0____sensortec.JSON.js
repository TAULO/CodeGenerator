//PENETRATION (SIP) STYLES
var penetration_Styles = [
	{value : "RIP", name : "penetrationStyles", label : '(RIP) RTD Insertion Probe'},
	{ value: "TIP", name: "penetrationStyles", label: '(TIP) Thermocouple Insertion Probe' },
	{ value: "MIP", name: "penetrationStyles", label: '(MIP) Miniature Insertion Probe' }

];

//SHEATH TERMINATION
var sheathTerm_Bulk = [
	{value : "A", name : "sheathTerm", label : '(A) Bulk Material, Stripped Lead'}
];

var sheathTerm_Leadwire = [
	{value : "B", name : "sheathTerm", label : '(B) No Transition Style'},
	{value : "C", name : "sheathTerm", label : '(C) Self-Gripping Spring w/6" Leads'},
	{value : "D", name : "sheathTerm", label : '(D) Transition Fitting (200&degC)'},
	{value : "E", name : "sheathTerm", label : '(E) Hi-Temp Transition Fitting (450&degC)'},
	{value : "F", name : "sheathTerm", label : '(F) Transition w/Relief Spring (200&degC)'},
	{value : "G", name : "sheathTerm", label : '(G) Hi-Temp Transition w/Relief Spring (450&degC)'}
];
							   
var sheathTerm_Plug = [
	{value : "K", name : "sheathTerm", label : '(K) Standard Male Plug (200&degC)'},
	{value : "L", name : "sheathTerm", label : '(L) Standard Plug w/ Mating Jack'},
	{value : "M", name : "sheathTerm", label : '(M) Standard Female Jack'},
	{value : "N", name : "sheathTerm", label : '(N) High-Temp Standard Male Plug'},
	{value : "O", name : "sheathTerm", label : '(O) High-Temp Standard Plug w/ Mating Jack'},
	{value : "P", name : "sheathTerm", label : '(P) High-Temp Standard Female Jack'},
	{value : "Q", name : "sheathTerm", label : '(Q) Miniature Male Plug (200&degC)'},
	{value : "R", name : "sheathTerm", label : '(R) Miniature Plug w/ Mating Jack'},
	{value : "S", name : "sheathTerm", label : '(S) Miniature Female Jack'}
];

var sheathTerm_Heads = [
	{value : "T", name : "sheathTerm", label : '(T) Flip-Top Cast Aluminum Head (200&degC)'},
	{value : "W", name : "sheathTerm", label : '(W) Explosion Proof Head (200&degC)'},
	{value : "X", name : "sheathTerm", label : '(X) Miniature Plastic Head (177&degC)'},
	{value : "Y", name : "sheathTerm", label : '(Y) Miniature Aluminum Head (200&degC)'},
	{value : "Z", name : "sheathTerm", label : '(Z) Plastic Open Disk Head (200&degC)'},
	{value : "1", name : "sheathTerm", label : '(1) Screw-Cover Cast Aluminum Head (200&degC)'},
	{value : "2", name : "sheathTerm", label : '(2) Screw-Cover Cast Iron Head (200&degC)'},
	{value : "4", name : "sheathTerm", label : '(4) Flip-Top Din Size "B" Aluminum WP Head (200&degC)'},
	{value : "5", name : "sheathTerm", label : '(5) Screw-Cover Polypropylene Head(90&degC)'},
	{value : "6", name : "sheathTerm", label : '(6) Canister Head 1/8"NPT or 1/4"NPT Only'},
	{value : "7", name : "sheathTerm", label : '(7) Screw-Cover Din Size "B" Aluminum WP Head (200&degC)'},
	{value : "8", name : "sheathTerm", label : '(8) Stainless Steel Weatherproof Head T-304 (200&degC)'}
];

//PLASTICS SHEATH TERMINATION
var plastics_Termination = [
	{value : "A", name : "plasticsTerm", label : '(A) 8" Spring Adjustable'},
	{value : "B", name : "plasticsTerm", label : '(B) 12" Spring Adjustable'},
	{value : "C", name : "plasticsTerm", label : '(C) Flex Armor Adjustable'},
	{value : "D", name : "plasticsTerm", label : '(D) Straight Fixed Bayonet'},
	{value : "E", name : "plasticsTerm", label : '(E) 45° Bent Fixed Bayonet'},
	{value : "F", name : "plasticsTerm", label : '(F) 90° Bent Fixed Bayonet'},
	{value : "G", name : "plasticsTerm", label : '(G) Straight Rigid Tube'},
	{value : "H", name : "plasticsTerm", label : '(H) 45° Bent Rigid Tube'},
	{value : "I", name : "plasticsTerm", label : '(I) 90° Bent Rigid Tube'},
	{value : "J", name : "plasticsTerm", label : '(J) Spade Style (T/C Only)'},
	{value : "K", name : "plasticsTerm", label : '(K) Washer / Lug'},
	{value : "L", name : "plasticsTerm", label : '(L) Sparkplug Gasket (T/C Only)'},
	{value : "M", name : "plasticsTerm", label : '(M) 3" Melt Bolt'},
	{value : "N", name : "plasticsTerm", label : '(N) 4" Melt Bolt'},
	{value : "O", name : "plasticsTerm", label : '(O) 6" Melt Bolt'},
	{value : "R", name : "plasticsTerm", label : '(R) Threaded Nozzle Bolt'},
	{value : "U", name : "plasticsTerm", label : '(U) Pipe Clamp Style'}
];

var sanitary_Well = [
    {value : "", name : "sanitaryWell", label : 'None'},
	{value : "SW", name : "sanitaryWell", label : '(SW) Sanitary Well'}
    ]

//ELEMENT TYPE
var element_Type = [
	{value : "A", config : "2", singleDual : "single", resistance : "100_Ohm"},
	{value : "B", config : "3", singleDual : "single", resistance : "100_Ohm"},
	{value : "C", config : "4", singleDual : "single", resistance : "100_Ohm"},
	{value : "D", config : "2", singleDual : "dual", resistance : "100_Ohm"},
	{value : "E", config : "3", singleDual : "dual", resistance : "100_Ohm"},
	{value : "F", config : "2", singleDual : "single", resistance : "500_Ohm"},
	{value : "G", config : "3", singleDual : "single", resistance : "500_Ohm"},
	{value : "H", config : "4", singleDual : "single", resistance : "500_Ohm"},
	{value : "I", config : "2", singleDual : "dual", resistance : "500_Ohm"},
	{value : "J", config : "3", singleDual : "dual", resistance : "500_Ohm"},
	{value : "K", config : "2", singleDual : "single", resistance : "1000_Ohm"},
	{value : "L", config : "3", singleDual : "single", resistance : "1000_Ohm"},
	{value : "M", config : "4", singleDual : "single", resistance : "1000_Ohm"},
	{value : "N", config : "2", singleDual : "dual", resistance : "1000_Ohm"},
	{value : "O", config : "3", singleDual : "dual", resistance : "1000_Ohm"},
	{value : "P", config : "2", singleDual : "single", resistance : "Copper_10"},
	{value : "Q", config : "3", singleDual : "single", resistance : "Copper_10"},
	{value : "R", config : "4", singleDual : "single", resistance : "Copper_10"},
	{value : "S", config : "2", singleDual : "single", resistance : "Nickel_120"},
	{value : "T", config : "3", singleDual : "single", resistance : "Nickel_120"},
	{value : "U", config : "4", singleDual : "single", resistance : "Nickel_120"},
	{value : "V", config : "2", singleDual : "single", resistance : "Nickel_604"},
	{value : "W", config : "3", singleDual : "single", resistance : "Nickel_604"},
	{value : "X", config : "4", singleDual : "single", resistance : "Nickel_604"}
]
var element_Config = [
	{value : "2", checked: "checked", name : "elementConfig", label : '2 Wire Element'},
	{value : "3", name : "elementConfig", label : '3 Wire Element'},
	{value : "4", name : "elementConfig", label : '4 Wire Element'}
];

var element_SingleDual = [
	{value : "single", checked: "checked", name : "elementSingleDual", label : 'Single RTD Element'},
	{value : "dual", name : "elementSingleDual", label : 'Dual RTD Element'}
];

var element_Resistance = [
	{value : "100_Ohm", checked: "checked", name : "elementResistance", label : 'Platinum 100 Ohm'},
	{value : "500_Ohm", name : "elementResistance", label : 'Platinum 500 Ohm'},
	{value : "1000_Ohm", name : "elementResistance", label : 'Platinum 1000 Ohm'},
	{value : "Copper_10", name : "elementResistance", label : 'Copper 10 Ohm'},
	{value : "Nickel_120", name : "elementResistance", label : 'Nickel 120 Ohm'},
	{value : "Nickel_604", name : "elementResistance", label : 'Nickel-Iron 604'}
];

//ACCURACY & TEMPERATURE COEFFICIENT
var element_Coefficient = [
	{value : "A", curve : "385", accuracy : "0.5" },
	{value : "B", curve : "392", accuracy : "0.5" },
	{value : "C", curve : "375", accuracy : "0.5" },
	{value : "D", curve : "385", accuracy : "0.25" },
	{value : "E", curve : "392", accuracy : "0.25" },
	{value : "F", curve : "375", accuracy : "0.25" },
	{value : "G", curve : "385", accuracy : "0.12" },
	{value : "H", curve : "392", accuracy : "0.12" },
	{value : "I", curve : "375", accuracy : "0.12" },
	{value : "J", curve : "385", accuracy : "0.06" },
	{value : "K", curve : "392", accuracy : "0.06" },
	{value : "L", curve : "375", accuracy : "0.06" },
	{value : "M", curve : "385", accuracy : "0.04" },
	{value : "N", curve : "392", accuracy : "0.04" },
	{value : "O", curve : "385", accuracy : "0.03" },
	{value : "P", curve : "392", accuracy : "0.03" },
	{value : "Q", curve : "385", accuracy : "0.01" },
	{value : "R", curve : "392", accuracy : "0.01" },
];

var element_Curve = [
	{value : "385", checked : "checked", name : "elementCurve", label : 'DIN .00385 Curve'},
	{value : "392", name : "elementCurve", label : 'JIS/US .00392 Curve'},
	{value : "375", name : "elementCurve", label : 'Appliance .00375 Curve'},	
];

var element_Accuracy = [
	{value : "0.5", checked : "checked", name : "elementAccuracy", label : 'Class 1.1 &plusmn;0.5% at 0&degC'},
	{value : "0.25", name : "elementAccuracy", label : 'Class 0.8 &plusmn;0.25% at 0&degC'},
	{value : "0.12", name : "elementAccuracy", label : 'Class B &plusmn;0.12% at 0&degC'},
	{value : "0.06", name : "elementAccuracy", label : 'Class A &plusmn;0.06% at 0&degC'},
	{value : "0.04", name : "elementAccuracy", label : '1/3 Class &plusmn;0.04% at 0&degC' },
	{value : "0.01", name : "elementAccuracy", label : '1/10 Class &plusmn;0.01% at 0&degC'}
];

//TEMPERATURE
var temperature = [
	{value : "L", name : "temperature", label : '(L) Low Temperature [-50&degC to 200&degC (-58&degF to 392&degF)]'},
	{value : "M", name : "temperature", label : '(M) Medium Temperature [-50&degC to 450&degC (-58&degF to 842&degF)]'},
	{value : "H", name : "temperature", label : '(H) High Temperature [-200&degC to 650&degC (-328&degF to 1202&degF)]'}
];

//CALIBRATION
var calibration = [
	{value : "J", name : "calibration", label : '(J) Type "J" [0&degC to 900&degC (32&degF to 1652&degF)]'},
	{value : "K", name : "calibration", label : '(K) Type "K" [0&degC to 1250&degC (32&degF to 2282&degF)]'},
	{value : "E", name : "calibration", label : '(E) Type "E" [0&degC to 900&degC (32&degF to 1652&degF)]'},
	{value : "T", name : "calibration", label : '(T) Type "T" [0&degC to 350&degC (32&degF to 662&degF)]'}
];

//THERMOCOUPLE TYPE
var thermocouple_Type = [
	{value : "0", name : "thermocoupleType", label : '(0) Standard Limits of Error, Single (2-Wire)'},
	{value : "1", name : "thermocoupleType", label : '(1) Special Limits of Error, Single (2-Wire)'},
	{value : "2", name : "thermocoupleType", label : '(2) High Purity (99.4&#37;) Insulation, Single (2-Wire)'},
	{value : "3", name : "thermocoupleType", label : '(3) Special Limits & High Purity, Single (2-Wire)'},
	{value : "4", name : "thermocoupleType", label : '(4) Standard Limits of Error, Duplex (4-Wire)'},
	{value : "5", name : "thermocoupleType", label : '(5) Special Limits of Error, Duplex (4-Wire)'},
	{value : "6", name : "thermocoupleType", label : '(6) High Purity (99.4&#37;) Insulation, Duplex (4-Wire)'},
	{value : "7", name : "thermocoupleType", label : '(7) Special Limits & High Purity, Duplex (4-Wire)'}
];

//EXTENSION CONFIGURATION
var extension_Config_RTD = [
    { value : "2", name: "extensionConfig", label : '(2) 2 Wire' },
    { value : "3", name: "extensionConfig", label : '(3) 3 Wire' },
    { value : "4", name: "extensionConfig", label : '(4) 4 Wire' },
    { value : "6", name: "extensionConfig", label : '(6) 6 Wire' }
];

var extension_Config_TC = [
    { value : "0", name: "extensionConfig", label : '(0) Single (2 wire)' },
    { value : "4", name: "extensionConfig", label : '(4) Duplex (4 wire)' }
];

var extension_QC_Termination = [
    { value: "T", name: "extensionTerm", label: '(T) Straight Mating Adapter - Molded [90&degC (194&degF)]' },
    { value: "U", name: "extensionTerm", label: '(U) 90&deg Mating Adapter - Molded [90&degC (194&degF)]' },
    { value: "V", name: "extensionTerm", label: '(V) Straight Mating Adapter - Field Installable [85&degC (185&degF)]' },
    { value: "W", name: "extensionTerm", label: '(W) 90&deg Mating Adapter - Field Installable [85&degC (174&degF)]' },

];

//JUNCTION TYPE
var junction_Type = [
	{value : "G", name : "junctionType", label : '(G) Grounded Junction'},
	{value : "U", name : "junctionType", label : '(U) Ungrounded Junction'},
	{value : "E", name : "junctionType", label : '(E) Exposed Junction'}
];

//EXTENSION TYPE
var extension_RTD_Type = [
	{value : "R", name : "extensionType", label : '(R) RTD Extension'},
	{value : "Q", name : "extensionType", label : '(Q) Quick Connect Extension'}
];

var extension_TC_Type = [
	{value : "J", name : "extensionType", label : '(J) Type "J" [0&degC to 900&degC (32&degF to 1652&degF)]'},
	{value : "K", name : "extensionType", label : '(K) Type "K" [0&degC to 1250&degC (32&degF to 2282&degF)]'},
	{value : "E", name : "extensionType", label : '(E) Type "E" [0&degC to 900&degC (32&degF to 1652&degF)]'},
	{value : "T", name : "extensionType", label : '(T) Type "T" [0&degC to 350&degC (32&degF to 662&degF)]'}
];

//SHEATH DIAMETER
var sheath_Diameter = [
	{value : "D", disabled : true, name : "diameter", label : '(D) 0.040" OD Sheath (call for quote)'},
	{value : "E", name : "diameter", label : '(E) 1/16" OD Sheath'},
	{value : "G", name : "diameter", label : '(G) 1/8" OD Sheath'},
	{value : "I", name : "diameter", label : '(I) 3/16" OD Sheath'},
	{value : "K", name : "diameter", label : '(K) 1/4" OD Sheath'},
	{value : "N", name : "diameter", label : '(N) 3/8" OD Sheath'},
	{value : "O", name : "diameter", label : '(O) 1/2" OD Sheath'}
];

var reduced_Sheath_Diameter = [
	{ value: "I", name: "reducedDiameter", label: '(I) 3/16" OD Sheath' },
	{ value: "K", name: "reducedDiameter", label: '(K) 1/4" OD Sheath' },
	{ value: "N", name: "reducedDiameter", label: '(N) 3/8" OD Sheath' },

];

//PENETRATION PROBE STYLE
var penetration_Probe_Style = [
	{ value: "1", name: "penetrationProbeStyle", label: '(1) Standard Transition Fitting - Stainless Steel' },
	{ value: "2", name: "penetrationProbeStyle", label: '(2) Straight Handle - Stainless Steel' },
	{ value: "3", name: "penetrationProbeStyle", label: '(3) Saber Handle - Stainless Steel' },
	{ value: "4", name: "penetrationProbeStyle", label: '(4) Flanged Handle - Stainless Steel' },
	{ value: "6", name: "penetrationProbeStyle", label: '(6) Euro Style - White Teflon' },
	{ value: "7", name: "penetrationProbeStyle", label: '(7) Euro Style - Stainless Steel' },
    { value: "8", name: "penetrationProbeStyle", label: '(8) Flanged Handle - White Teflon' }
];

//PENETRATION DIAMETERS
var penetration_Diameter = [
	{value : "B", name : "penetrationDiameter", label : '(B) .134" OD Hypodermic Sheath'},
	{value : "C", name : "penetrationDiameter", label : '(C) .180" OD Hypodermic Sheath'}
];

//REDUCED TIP SHEATH DIAMETERS
var reduced_Tip_Diameter = [
	{value : "I", name : "reducedDiameter", label : '(I) 3/16" OD Sheath'},
	{value : "K", name : "reducedDiameter", label : '(K) 1/4" OD Sheath'},
	{value : "N", name : "reducedDiameter", label : '(K) 1/4" OD Sheath'}
];

//THERMOWELL CONFIGURATION TYPE
var thermowell_Config = [
	{value : "1", checked: "checked", name : "thermowellConfig", label : '(1) Head w/Hex Nipple'},
	{value : "2", name : "thermowellConfig", label : '(2) Head w/Pipe Nipple Only'},
	{value : "3", name : "thermowellConfig", label : '(3) Head w/Hex Nipple & Union'},
	{value : "4", name : "thermowellConfig", label : '(4) Head w/Hex Nipple/Union/Pipe Nipple'}
];

var thermowell_Extension = [
	{value : "01",  checked: "checked", name : "thermowellExtension", label : '(01) 1 Inch Nominal Extension'},
	{value : "02", disabled : true, name : "thermowellExtension", label : '(02) 2 Inch Nominal Extension'},
	{value : "03", disabled : true, name : "thermowellExtension", label : '(03) 3 Inch Nominal Extension'},
	{value : "04", disabled : true, name : "thermowellExtension", label : '(04) 4 Inch Nominal Extension'},
	{value : "05", disabled : true, name : "thermowellExtension", label : '(05) 5 Inch Nominal Extension'},
	{value : "06", disabled : true, name : "thermowellExtension", label : '(06) 6 Inch Nominal Extension'}
];

//THERMOWELL ASSEMBLY MATERIAL
var tw_Assembly_Material = [
	{value : "W", name : "twAssemblyMaterial", label : '(W) 316 SST'},
	{ value: "T", name: "twAssemblyMaterial", label: '(T) 304 SST' },
	{ value: "D", name: "twAssemblyMaterial", label: '(D) Steel/Iron' }
];

//SHEATH MATERIAL
var sheath_Material = [
	{value : "W", name : "material", label : '(W) 316 SST'},
	{value : "T", name : "material", label : '(T) 304 SST'},
	{value : "J", name : "material", label : '(J) Inconel 600'},
	{value : "S", name : "material", label : '(S) 446 SST'},
	{value : "H", name : "material", label : '(H) Hastelloy C'},
	{value: "D", name: "material", label: '(D) Steel/Iron' },
    {value: "V", name: "material", label: '(V) 310 SST' }
];

//THERMOWELL TYPE
var thermowell_Type = [
	{value : "R", name : "thermowellType", label : '(R) Reduced Stem Thermowell'},
	{value : "S", name : "thermowellType", label : '(S) Straight Stem Thermowell'},
	{value : "H", name : "thermowellType", label : '(H) Heavy Duty Thermowell'},
	{value : "FS", name : "thermowellType", label : '(FS) Flanged Thermowell'},
	{value : "FH", name : "thermowellType", label : '(FH) Heavy Duty Flanged Thermowell'}
];

//THERMOWELL LAG
var thermowell_Lag = [
	{value : "0", name : "thermowellLag", label : '(0) Non-Lagging'},
	{value : "L", name : "thermowellLag", label : '(L) Lagging'}
];

//THERMOWELL BORE
var thermowell_Bore = [
	{value : "2", name : "thermowellBore", label : '(2) .260" Bore for 1/4" OD Elements'},
	{value : "3", name : "thermowellBore", label : '(3) .390" Bore for 3/8" OD Elements'}
];

//THERMOWELL PROCESS THREAD
var thermowell_Thread = [
	{value : "5", name : "thermowellThread", label : '(5) 1/2"NPT Process Connection'},
	{value : "7", name : "thermowellThread", label : '(7) 3/4"NPT Process Connection'},
	{value : "1", name : "thermowellThread", label : '(1) 1"NPT Process Connection'}
];

//THERMOWELL FLANGE SIZE
var thermowell_Flange_Size = [
	{value : "A", name : "thermowellFlangeSize", label : '(A) 3/4" Flange Size'},
	{value : "B", name : "thermowellFlangeSize", label : '(B) 1" Flange Size'},
	{value : "C", name : "thermowellFlangeSize", label : '(C) 1-1/2" Flange Size'},
	{value : "D", name : "thermowellFlangeSize", label : '(D) 2" Flange Size'},
	{value : "E", name : "thermowellFlangeSize", label : '(E) 3" Flange Size'}
];

//THERMOWELL RATING
var thermowell_Rating = [
	{value : "1", name : "thermowellRating", label : '(1) 150 lbs'},
	{value : "2", name : "thermowellRating", label : '(2) 300 lbs'},
	{value : "3", name : "thermowellRating", label : '(3) 600 lbs'},
	{value : "4", name : "thermowellRating", label : '(4) 900 lbs'},
	{value : "5", name : "thermowellRating", label : '(5) 1500 lbs'},
	{value : "6", name : "thermowellRating", label : '(6) 2500 lbs'}
];

//THERMOWELL FLANGE TYPE
var thermowell_Flange_Type = [
	{value : "R", name : "thermowellFlangeType", label : '(R) Raised Face'},
	{value : "F", name : "thermowellFlangeType", label : '(F) Flate Face'},
	{value : "J", name : "thermowellFlangeType", label : '(J) Ring Joint'}
];

//SHEATH FRACTIONAL LENGTH
var sheath_Fractional_Length = [
	{value : "A", name : "fractionalLength", label : '(A) None'},
	{value : "B", name : "fractionalLength", label : '(B) 1/16 Inch'},
	{value : "C", name : "fractionalLength", label : '(C) 1/8 Inch'},
	{value : "E", name : "fractionalLength", label : '(E) 3/16 Inch'},
	{value : "G", name : "fractionalLength", label : '(G) 1/4 Inch'},
	{value : "J", name : "fractionalLength", label : '(J) 3/8 Inch'},
	{value : "L", name : "fractionalLength", label : '(L) 1/2 Inch'},
	{value : "N", name : "fractionalLength", label : '(N) 5/8 Inch'},
	{value : "Q", name : "fractionalLength", label : '(Q) 3/4 Inch'},
	{value : "S", name : "fractionalLength", label : '(S) 7/8 Inch'},
];
//SHEATH FRACTIONAL LENGTH
var tw_Standard_Insertion = [
	{value : "016", name : "standardInsertion", label : '(016) 1-5/8" Insertion Length'},
	{value : "025", name : "standardInsertion", label : '(025) 2-1/2" Insertion Length'},
	{value : "035", name : "standardInsertion", label : '(035) 3-1/2" Insertion Length'},
	{value : "045", name : "standardInsertion", label : '(045) 4-1/2" Insertion Length'},
	{value : "055", name : "standardInsertion", label : '(055) 5-1/2" Insertion Length'},
	{value : "065", name : "standardInsertion", label : '(065) 6-1/2" Insertion Length'},
	{value : "075", name : "standardInsertion", label : '(075) 7-1/2" Insertion Length'},
	{value : "085", name : "standardInsertion", label : '(085) 8-1/2" Insertion Length'}
];

//SHEATH FRACTIONAL LENGTH
var tw_Flanged_Insertion = [
	{value : "020", name : "flangedInsertion", label : '(020) 2" Insertion Length'},
	{value : "030", name : "flangedInsertion", label : '(030) 3" Insertion Length'},
	{value : "040", name : "flangedInsertion", label : '(040) 4" Insertion Length'},
	{value : "050", name : "flangedInsertion", label : '(050) 5" Insertion Length'},
	{value : "060", name : "flangedInsertion", label : '(060) 6" Insertion Length'},
	{value : "070", name : "flangedInsertion", label : '(070) 7" Insertion Length'},
	{value : "080", name : "flangedInsertion", label : '(080) 8" Insertion Length'},
	{value : "090", name : "flangedInsertion", label : '(090) 9" Insertion Length'},
	{value : "100", name : "flangedInsertion", label : '(100) 10" Insertion Length'},
	{value : "120", name : "flangedInsertion", label : '(120) 12" Insertion Length'},

];

//THERMOWELL MATERIAL
var tw_Material = [
	{value : "A", name : "thermowellMaterial", label : '(A) Brass'},
	{ value: "D", name: "thermowellMaterial", label: '(D) C1018 Carbon Steel' },
	{ value: "T", name: "thermowellMaterial", label: '(T) 304 SST' },
	{ value: "W", name: "thermowellMaterial", label: '(W) 316 SST' }
];


//PLASTICS SPADE MATERIAL
var spade_Material = [
	{value : "B", name : "spadeMaterial", label : '(B) Brass Spade Material'},
	{value : "S", name : "spadeMaterial", label : '(S) Stainless Steel Spade Material'},
];

//PLASTICS RING TYPE
var ring_Type = [
	{value : "D", name : "ringType", label : '(D) Double Cupped Washer'},
	{value : "L", name : "ringType", label : '(L) Electrical Lug'},
];

//PLASTICS STUD SIZE
var stud_Size = [
	{value : "1", name : "spadeMaterial", label : '(1) #6 Stud Size'},
	{value : "2", name : "spadeMaterial", label : '(2) #8 Stud Size'},
	{value : "3", name : "spadeMaterial", label : '(3) #10 Stud Size'},
	{value : "4", name : "spadeMaterial", label : '(4) 1/4" Stud Size'},
	{value : "5", name : "spadeMaterial", label : '(5) 5/16" Stud Size'},
	{value : "6", name : "spadeMaterial", label : '(6) 3/8" Stud Size'}
];

//PLASTICS SPARK PLUG GASKET SIZE
var gasket_Size = [
	{value : "J", name : "gasketSize", label : '(J) 10mm (.39" ID)'},
	{value : "L", name : "gasketSize", label : '(L) 12mm (.47" ID)'},
	{value : "M", name : "gasketSize", label : '(M) 14mm (.55" ID)'}
];

//PLASTICS SPARK PLUG GASKET FORK STYLE
var fork_Style = [
	{value : "S", name : "gasketSize", label : '(S) Straight'},
	{value : "B", name : "gasketSize", label : '(B) Bent 70&deg'}
];

//PLASTICS PIPE CLAMP
var pipe_Clamp = [
	{value : "12", name : "pipeClamp", label : '(12) 11/16" to 1-1/4"'},
	{value : "24", name : "pipeClamp", label : '(24) 1-1/16" to 2"'},
	{value : "44", name : "pipeClamp", label : '(44) 2" to 3-1/4"'},
	{value : "60", name : "pipeClamp", label : '(60) 3" to 4-1/4"'},
	{value : "88", name : "pipeClamp", label : '(88) 4-3/4" to 6"'},
	{value : "96", name : "pipeClamp", label : '(96) 5-1/4" to 6-1/2"'},
	{value : "98", name : "pipeClamp", label : '(98) 5-3/4" to 7"'}
];

//STRIP LENGTH (BULK MATERIAL)
var bulk_Strip_Length = [
	{value : "A", name : "sheathFitting", label : '(A) 1/4" Strip'},
	{value : "B", name : "sheathFitting", label : '(B) 1/2" Strip'},
	{value : "C", name : "sheathFitting", label : '(C) 3/4" Strip'},
	{value : "D", name : "sheathFitting", label : '(D) 1" Strip'},
	{value : "E", name : "sheathFitting", label : '(E) 2" Strip'},
	{value : "F", name : "sheathFitting", label : '(F) 2-1/2" Strip'},
	{value : "G", name : "sheathFitting", label : '(G) 3" Strip'},
	{value : "H", name : "sheathFitting", label : '(H) 3-1/2" Strip'},
	{value : "I", name : "sheathFitting", label : '(I) 4" Strip'},
	{value : "J", name : "sheathFitting", label : '(J) 4-1/2" Strip'},
	{value : "K", name : "sheathFitting", label : '(K) 5" Strip'},
];

//SHEATH FITTINGS
var sheath_Fitting_None = [
	{value : "00", name : "sheathFitting", label : '(00) No Sheath Fitting'}
];

var sheath_Fixed_Hex_Nipples = [
	{value : "45", name : "sheathFitting", label : '(45) Steel Hex Nipple, 1/2"NPT'},
	{value : "46", name : "sheathFitting", label : '(46) 316 SST Hex Nipple, 1/8"NPT'},
	{value : "47", name : "sheathFitting", label : '(47) 316 SST Hex Nipple, 1/4"NPT'},
	{value : "48", name : "sheathFitting", label : '(48) 316 SST Hex Nipple, 1/2"NPT'},
	{value : "60", name : "sheathFitting", label : '(60) 316 SST Hex Nipple, 3/4"NPT'},
	{value : "61", name : "sheathFitting", label : '(61) 316 SST Hex Nipple, 1"NPT'},
	{value : "63", name : "sheathFitting", label : '(63) 316 SST Hex Nipple, 3/4"NPT Process x 1/2"NPT'}
];

var sheath_Spring_Loaded_Hex_Nipples = [
	{value : "55", name : "sheathFitting", label : '(55) Steel Spring Loaded Hex Nipple, 1/2"NPT'},
	{value : "56", name : "sheathFitting", label : '(56) 316 SST Spring Loaded Hex Nipple, 1/2"NPT'},
	{value : "57", name : "sheathFitting", label : '(57) 316 SST Self Contained Spring Loaded Hex Nipple, 1/2"NPT'}
];

var sheath_304_Hex_Bushings = [
	{value : "5A", name : "sheathFitting", label : '(5A) 304 SST Hex Bushing, 1/8"NPT'},
	{value : "5B", name : "sheathFitting", label : '(5B) 304 SST Hex Bushing, 1/4"NPT'},
	{value : "5D", name : "sheathFitting", label : '(5D) 304 SST Hex Bushing, 1/2"NPT'}
];

var sheath_316_Hex_Bushings = [
	{value : "6A", name : "sheathFitting", label : '(6A) 316 SST Hex Bushing, 1/8"NPT'},
	{value : "6B", name : "sheathFitting", label : '(6B) 316 SST Hex Bushing, 1/4"NPT'},
	{value : "6D", name : "sheathFitting", label : '(6D) 316 SST Hex Bushing, 1/2"NPT'},
	{value : "6E", name : "sheathFitting", label : '(6E) 316 SST Hex Bushing, 3/4"NPT'}
];

var sheath_Adj_Comp_Fittings = [
	{value : "1A", name : "sheathFitting", label : '(1A) SST Compression Fitting, 1/8"NPT'},
	{value : "1B", name : "sheathFitting", label : '(1B) SST Compression Fitting, 1/4"NPT'},
	{value : "1D", name : "sheathFitting", label : '(1D) SST Compression Fitting, 1/2"NPT'},
	{value : "2A", name : "sheathFitting", label : '(2A) Brass Compression Fitting, 1/8"NPT'},
	{value : "2B", name : "sheathFitting", label : '(2B) Brass Compression Fitting, 1/4"NPT'},
	{value : "2D", name : "sheathFitting", label : '(2D) Brass Compression Fitting, 1/2"NPT'}
];

var sheath_ReAdj_Comp_Fittings = [
	{value : "3A", name : "sheathFitting", label : '(3A) SST Re-Adj Compression Fitting, 1/8"NPT'},
	{value : "3B", name : "sheathFitting", label : '(3B) SST Re-Adj Compression Fitting, 1/4"NPT'},
	{value : "3D", name : "sheathFitting", label : '(3D) SST Re-Adj Compression Fitting, 1/2"NPT'}
];

var sheath_Flange_Bayonet = [
	{value : "25", name : "sheathFitting", label : '(25) Flange w/Brass Compression Fitting'},
	{value : "26", name : "sheathFitting", label : '(26) Flange w/SST Compression Fitting'},
	{value : "27", name : "sheathFitting", label : '(27) Adjustable Bayonet Fitting, 1/8"OD Sheath Only'},
	{value : "28", name : "sheathFitting", label : '(28) Re-Adjustable Bayonet Fitting, 1/8"OD Sheath Only'},
	{value : "29", name : "sheathFitting", label : '(29) Fixed Bayonet Fitting,1/8", 3/16", 1/4" OD Sheath'}
];

var sheath_Bend = [
	{value : "A", name : "sheathFitting", label : '(A) 90° Bend'},
	{value : "B", name : "sheathFitting", label : '(B) 45° Bend'}
];

var sheath_Flat_Pads = [
	{value : "35", name : "sheathFitting", label : '(35) Perpendicular Weld Pad, 316 SST, 1" x 1"'},
	{value : "36", name : "sheathFitting", label : '(36) Horizontal Weld Pad, 316 SST, 1" x 1"'}
];

var sheath_Radius_Pads = [
	{value : "37", name : "sheathFitting", label : '(37) Perpendicular Radius Weld Pad, 316 SST, 1" x 1"'},
	{value : "38", name : "sheathFitting", label : '(38) Horizontal Radius Weld Pad, 316 SST, 1" x 1"'}
];

//CIP CAPS
var cip_Caps = [
	{value : "A1", name : "cipCaps", label : '(A1) 3/4" 16 AMP Clamp Cap'},
	{value : "A2", name : "cipCaps", label : '(A2) 1-1/2" 16 AMP Clamp Cap'},
	{value : "A3", name : "cipCaps", label : '(A3) 2" 16 AMP Clamp Cap'},
	{value : "A4", name : "cipCaps", label : '(A4) 2-1/2" 16 AMP Clamp Cap'},
	{value : "A5", name : "cipCaps", label : '(A5) 3" 16 AMP Clamp Cap'},
	{value : "A6", name : "cipCaps", label : '(A6) 4" 16 AMP Clamp Cap"'}
];

var thermo_Replacement = [
	{ value: "TR", name: "cipCaps", label: '(TR) Thermometer Replacement' }
];



//LEADWIRE
var leadwire_Teflon = [
	{value : "1", name : "leadwire", label : '(1) Stranded Teflon Singles'},
	{value : "2", name : "leadwire", label : '(2) Bullet Proof Teflon'},
	{value : "M", name : "leadwire", label : '(M) Stranded Teflon Cable'},
	{value : "N", name : "leadwire", label : '(N) Stranded Teflon Cable w/SST Flex Armor'},
	{value : "O", name : "leadwire", label : '(O) Stranded Teflon Cable w/SST Over Braid'},
	{value : "P", name : "leadwire", label : '(P) Stranded Shielded Teflon Cable'},
	{value : "J", disabled : true, name : "leadwire", label : '(J) Solid FEP Teflon Cable'},
	{value : "K", disabled : true, name : "leadwire", label : '(K) Solid FEP Teflon Cable w/SST Flex Armor'},
	{value : "L", disabled : true, name : "leadwire", label : '(L) Solid FEP Teflon Cable w/SST Over Braid'},
	{value : "5", disabled : true, name : "leadwire", label : '(5) Solid TFE Teflon Cable w/SST Flex Armor'},
	{value : "6", disabled : true, name : "leadwire", label : '(6) Solid TFE Teflon Cable w/SST Over Braid'},
	{value : "7", disabled : true, name : "leadwire", label : '(7) Stranded TFE Teflon Cable'}
];

var leadwire_Fiberglass = [
	{value : "D", name : "leadwire", label : '(D) Stranded Fiberglass Cable'},
	{value : "E", name : "leadwire", label : '(E) Stranded Fiberglass Cable w/SST Flex Armor'},
	{value : "F", name : "leadwire", label : '(F) Stranded Fiberglass Cable w/SST Over Braid'},
	{value : "8", name : "leadwire", label : '(8) Stranded Fiberglass Cable w/SST Over Braid & Flex Armor'},
	{value : "9", name : "leadwire", label : '(9) Stranded Fiberglass Singles'},
	{value : "A", disabled : true, name : "leadwire", label : '(A) Solid Fiberglass Cable'},
	{value : "B", disabled : true, name : "leadwire", label : '(B) Solid Fiberglass Cable w/SST Flex Armor'},
	{value : "C", disabled : true, name : "leadwire", label : '(C) Solid Fiberglass Cable w/SST Over Braid'},
	{value : "G", disabled : true, name : "leadwire", label : '(G) Solid High-Temperature Fiberglass'},
	{value : "H", disabled : true, name : "leadwire", label : '(H) Solid High-Temp Fiberglass w/SST Flex Armor'},
	{value : "I", disabled : true, name : "leadwire", label : '(I) Solid High-Temp Fiberglass w/SST Over Braid'}
];

var leadwire_PVC = [
	{value : "3", name : "leadwire", label : '(3) Stranded PVC Singles'},
	{value : "S", name : "leadwire", label : '(S) Stranded PVC Cable'},
	{value : "T", name : "leadwire", label : '(T) Stranded PVC Cable w/SST Flex Armor'},
	{value : "Q", disabled : true, name : "leadwire", label : '(Q) Solid PVC Cable'},
	{value : "R", disabled : true, name : "leadwire", label : '(R) Solid PVC Cable w/SST Flex Armor'}
];

var leadwire_CoilCord = [
    {value : "CC10", name : "leadwire", label : '(CC10) Coil Cord 10" Long'},
    {value : "CC24", name : "leadwire", label : '(CC24) Coil Cord 24" Long'},
    {value : "CC32", name : "leadwire", label : '(CC32) Coil Cord 32" Long'},
    {value : "CC60", name : "leadwire", label : '(CC60) Coil Cord 60" Long'},
];


//LEADWIRE TERMINATION
var leadwire_Termination = [
	{value : "A", name : "leadwireTermination", label : '(A) No Termination'},
	{value : "B", name : "leadwireTermination", label : '(B) 2-1/2" Split Leads'},
	{value : "C", name : "leadwireTermination", label : '(C) 2-1/2" Split Leads w/#8 Spade Lugs'},
	{value : "D", name : "leadwireTermination", label : '(D) 2-1/2" Split Leads w/#8 Spade Lugs & BX Connector'},
	{value : "E", name : "leadwireTermination", label : '(E) 2-1/2" Split Leads with 1/4 Push-On Connectors'},
	{value : "J", name : "leadwireTermination", label : '(J) 2-1/2" Split Leads w/Insulated Crimp Pins'},
	{value : "K", name : "leadwireTermination", label : '(K) Standard Male Plug (200°C)'},
	{value : "L", name : "leadwireTermination", label : '(L) Standard Male Plug w/Mating Jack (200°C)'},
	{value : "M", name : "leadwireTermination", label : '(M) Standard Female Jack (200°C)'},
	{value : "N", name : "leadwireTermination", label : '(N) High Temp Male Plug (425°C)'},
	{value : "O", name : "leadwireTermination", label : '(O) High Temp Male Plug w/Mating Jack (425°C)'},
	{value : "P", name : "leadwireTermination", label : '(P) High Temp Female Jack (425°C)'},
	{value : "Q", name : "leadwireTermination", label : '(Q) Miniature Male Plug (200°C)'},
	{value : "R", name : "leadwireTermination", label : '(R) Miniature Male Plug w/Mating Jack (200°C)'},
	{value : "S", name : "leadwireTermination", label : '(S) Miniature Female Jack (200°C)'},
];

//PLASTICS NOZZLE BOLT SIZE
var nozzle_Bolt = [
	{value : "1", name : "gasketSize", label : '(1) 1/4"-20 x 3/8" Long Nozzle Bolt'},
	{value : "2", name : "gasketSize", label : '(2) 1/4"-28 x 3/8" Long Nozzle Bolt'},
	{value : "3", name : "gasketSize", label : '(3) M6 x 1.00 x 12mm Long Nozzle Bolt'},
	{value : "4", name : "gasketSize", label : '(4) M8 x 1.25 x 12mm Long Nozzle Bolt'}
];



//QUICK CONNECT OPTIONS
var qc_Options = [
	{value : "A", name : "qcOptions", label : '(A) No Mating Adapter'},
	{value : "B", name : "qcOptions", label : '(B) Straight Mating Adapter'},
	{value : "C", name : "qcOptions", label : '(C) 90&deg Mating Adapter'}
];



//SPECIAL OPTIONS
var option1_Transmitter = [
	{ value: "Q2", name: "option1", label: '(Q2) Intelligent Isolated Transmitter - RTD/TC' },
	{ value: "Q4", name: "option1", label: '(Q4) Universal Hart Compatible Transmitter' },
	{ value: "Q7", name: "option1", label: '(Q7) RTD Transmitter' },
	{ value: "Q7X", name: "option1", label: '(Q7X) RTD Transmitter - Intrinsically safe' },
	{ value: "Q9", name: "option1", label: '(Q9) Intelligent Non-Isolated Transmitter' },
	{ value: "Q10", name: "option1", label: '(Q10) RTD Transmitter' }
];

var option1_Head = [
	{ value: "E", name: "option1", label: '(E) Epoxy Coated Head' },
	{ value: "G", name: "option1", label: '(G) Ground Screw' },
	{ value: "R", name: "option1", label: '(R) Conduit Reducer, 1/2"NPT' },
	{ value: "SR", name: "option1", label: '(SR) Stainless Steel Reducer' },
	{ value: "I", name: "option1", label: '(I) Stainless Steel Tag' }
];

var option1_Sheath = [
	{ value: "H", name: "option1", label: '(H) Flat Ended Sheath' },
	{ value: "O", name: "option1", label: '(O) Cuttable RTD 3"' },
	{ value: "T", name: "option1", label: '(T) Teflon Coated Sheath' },
	{ value: "X", name: "option1", label: '(X) Electro Etching on Sheath' }
];

var option1_Plug = [
	{ value: "C", name: "option1", label: '(C) Tube Adapter / Cable Clamp' },
	{ value: "P", name: "option1", label: '(P) Epoxy Fill Connector' },
	{ value: "S", name: "option1", label: '(S) Solid Pin Plug' }
];

var option1_Fitting = [
	{ value: "L", name: "option1", label: '(L) Lava Ferrule in Compression Fitting' },
	{ value: "N", name: "option1", label: '(N) Neoprene Ferrule in Compression Fitting' },
	{ value: "D", name: "option1", label: '(D) Braze Crimp Adapter on Sheath' }
];

var option1_Leadwire = [
	{value : "F", name : "option1", label : '(F) BX Connector'},
	{ value: "J", name: "option1", label: '(J) PVC Coated Flex' },
	{ value: "K", name: "option1", label: '(K) FEP Coated Flex' }
];

var option2_Transmitter = [
	{ value: "Q2", name: "option2", label: '(Q2) Intelligent Isolated Transmitter - RTD/TC' },
	{ value: "Q4", name: "option2", label: '(Q4) Universal Hart Compatible Transmitter' },
	{ value: "Q7", name: "option2", label: '(Q7) RTD Transmitter' },
	{ value: "Q7X", name: "option2", label: '(Q7X) RTD Transmitter - Intrinsically safe' },
	{ value: "Q9", name: "option2", label: '(Q9) Intelligent Non-Isolated Transmitter' },
	{ value: "Q10", name: "option2", label: '(Q10) RTD Transmitter' }
];

var option2_Head = [
	{ value: "E", name: "option2", label: '(E) Epoxy Coated Head' },
	{ value: "G", name: "option2", label: '(G) Ground Screw' },
	{ value: "R", name: "option2", label: '(R) Conduit Reducer, 1/2"NPT' },
	{ value: "SR", name: "option2", label: '(SR) Stainless Steel Reducer' },
	{ value: "I", name: "option2", label: '(I) Stainless Steel Tag' }
];

var option2_Sheath = [
	{ value: "H", name: "option2", label: '(H) Flat Ended Sheath' },
	{ value: "O", name: "option2", label: '(O) Cuttable RTD 3"' },
	{ value: "T", name: "option2", label: '(T) Teflon Coated Sheath' },
	{ value: "X", name: "option2", label: '(X) Electro Etching on Sheath' }
];

var option2_Plug = [
	{ value: "C", name: "option2", label: '(C) Tube Adapter / Cable Clamp' },
	{ value: "P", name: "option2", label: '(P) Epoxy Fill Connector' },
	{ value: "S", name: "option2", label: '(S) Solid Pin Plug' }
];

var option2_Fitting = [
	{ value: "L", name: "option2", label: '(L) Lava Ferrule in Compression Fitting' },
	{ value: "N", name: "option2", label: '(N) Neoprene Ferrule in Compression Fitting' },
	{ value: "D", name: "option2", label: '(D) Braze Crimp Adapter on Sheath' }
];

var option2_Leadwire = [
	{ value: "F", name: "option2", label: '(F) BX Connector' },
	{ value: "J", name: "option2", label: '(J) PVC Coated Flex' },
	{ value: "K", name: "option2", label: '(K) FEP Coated Flex' }
];



//3 DIGIT CODE
var special_Codes = [
	{value : "009", name : "codes", label : '(009) High temperature Epoxy'},
	{value : "010", name : "codes", label : '(010) Rubber boot on connector'},
	{value : "013", name : "codes", label : '(013) Apply fitting with threads towards cold end'},
	{value : "014", name : "codes", label : '(014) Less connection head & block'},
	{value : "019", name : "codes", label : '(019) Thermal media around element'},
	{value : "022", name : "codes", label : '(022) Lanyard & clip for flip cover head'},
	{value : "028", name : "codes", label : '(028) Substitute black poly head'},
	{value : "033", name : "codes", label : '(033) Substitute white poly head'},
	{value : "043", name : "codes", label : '(043) Pointed sensor tip'},
	{value : "053", name : "codes", label : '(053) High temperature cement'},
	{value : "054", name : "codes", label : '(054) Install green ground wire between ground screw and brass terminal'},
	{value : "056", name : "codes", label : '(056) Back fill & seal plastic (Up to 3")'},
	{value : "064", name : "codes", label : '(064) 4mm OD transition w/high temperature epoxy'},
	{value : "066", name : "codes", label : '(066) Cuttable probe'},
	{value : "087", name : "codes", label : '(087) Use 1/4" OD transition fitting'}

];

