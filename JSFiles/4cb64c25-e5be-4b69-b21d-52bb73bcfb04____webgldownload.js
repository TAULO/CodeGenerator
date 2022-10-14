var SEED_START = 7000; // there are approximately 50 (x2) images to gen
var DISK_DISTANCE = 2;
var PIP_DISTANCE = 0.1;
var seed = SEED_START;
var file_extension = ".jpeg"

var amplitude30 = 0.45;
var amplitude45 = 0.35;
var amplitude60 = 0.16;

function choiceEnumString(choiceEnum) {
	if (choiceEnum == ChoiceEnum.HILL) {
		return "Hill";
	} else {
		return "Valley";
	}
}


function downloadCanvas(renderer, filename = "canvas_images.jpeg") {

	// Convert the canvas to data
	var image = renderer.domElement.toDataURL();
	// Create a link
	var aDownloadLink = document.createElement('a');
	// Add the name of the file to the link
	aDownloadLink.download = filename;
	// Attach the data to the link
	aDownloadLink.href = image;
	// Get the code to click the download link
	aDownloadLink.click();
	
}

// DOWNLOAD FILES

function generateSingleDirectionalLight30FloorSlantMatte(choiceEnum) {
	/* generate all our stimulus ahead of time */
	amplitude = amplitude30;
	surfaceSlant = 30;

	seed ++;
	domDirectionalLightTest_30_20_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(20)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_20_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_20_1" + file_extension);
	domDirectionalLightTest_30_20_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(20)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_20_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_20_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_30_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_30_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_30_1" + file_extension);
	domDirectionalLightTest_30_30_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_30_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_30_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_40_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(40)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_40_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_40_1" + file_extension);
	domDirectionalLightTest_30_40_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(40)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_40_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_40_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_50_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_50_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_50_1" + file_extension);
	domDirectionalLightTest_30_50_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_50_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_50_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_60_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_60_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_60_1" + file_extension);
	domDirectionalLightTest_30_60_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_60_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_60_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_70_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(70)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_70_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_70_1" + file_extension);
	domDirectionalLightTest_30_70_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(70)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_70_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_70_2" + file_extension);
}

function generateSingleDirectionalLight45FloorSlantMatte(choiceEnum) {
	// /* generate all our stimulus ahead of time */
	amplitude = amplitude45;
	surfaceSlant = 45;

	seed ++;
	domDirectionalLightTest_45_30_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_30_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_30_1" + file_extension);
	domDirectionalLightTest_45_30_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_30_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_30_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_45_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(45)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_45_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_45_1" + file_extension);
	domDirectionalLightTest_45_45_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(45)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_45_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_45_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_60_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_60_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_60_1" + file_extension);
	domDirectionalLightTest_45_60_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_60_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_60_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_75_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(77)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_75_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_75_1" + file_extension);
	domDirectionalLightTest_45_75_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(77)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_75_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_75_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_90_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_90_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_90_1" + file_extension);
	domDirectionalLightTest_45_90_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_90_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_90_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_100_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_100_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_100_1" + file_extension);
	domDirectionalLightTest_45_100_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_100_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_100_2" + file_extension);
}

function generateSingleDirectionalLight60FloorSlantMatte(choiceEnum) {
	/* generate all our stimulus ahead of time */
	amplitude = amplitude60;
	surfaceSlant = 60;

	seed ++;
	domDirectionalLightTest_60_90_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_90_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_90_1" + file_extension);
	domDirectionalLightTest_60_90_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_90_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_90_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_100_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_100_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_100_1" + file_extension);
	domDirectionalLightTest_60_100_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_100_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_100_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_110_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(110)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_110_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_110_1" + file_extension);
	domDirectionalLightTest_60_110_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(110)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_110_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_110_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_120_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(120)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_120_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_120_1" + file_extension);
	domDirectionalLightTest_60_120_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(120)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_120_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_120_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_130_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(130)], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_130_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_130_1" + file_extension);
	domDirectionalLightTest_60_130_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(130)], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_130_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_130_2" + file_extension);
}

function generateSingleDirectionalLight30FloorSlantGlossy(choiceEnum) {
	/* generate all our stimulus ahead of time */
	amplitude = amplitude30;
	surfaceSlant = 30;

	seed ++;
	domDirectionalLightTest_30_20_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(20)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_20_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_20_1" + file_extension);
	domDirectionalLightTest_30_20_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(20)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_20_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_20_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_30_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_30_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_30_1" + file_extension);
	domDirectionalLightTest_30_30_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_30_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_30_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_40_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(40)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_40_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_40_1" + file_extension);
	domDirectionalLightTest_30_40_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(40)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_40_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_40_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_50_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_50_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_50_1" + file_extension);
	domDirectionalLightTest_30_50_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_50_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_50_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_60_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_60_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_60_1" + file_extension);
	domDirectionalLightTest_30_60_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_60_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_60_2" + file_extension);
	seed ++;
	domDirectionalLightTest_30_70_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(70)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_70_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_70_1" + file_extension);
	domDirectionalLightTest_30_70_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(70)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_30_70_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_70_2" + file_extension);
}

function generateSingleDirectionalLight45FloorSlantGlossy(choiceEnum) {
	/* generate all our stimulus ahead of time */
	amplitude = amplitude45;
	surfaceSlant = 45;

	seed ++;
	domDirectionalLightTest_45_30_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_30_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_30_1" + file_extension);
	domDirectionalLightTest_45_30_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(30)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_30_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_30_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_45_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(45)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_45_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_45_1" + file_extension);
	domDirectionalLightTest_45_45_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(45)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_45_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_45_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_60_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_60_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_60_1" + file_extension);
	domDirectionalLightTest_45_60_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(60)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_60_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_60_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_75_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(75)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_75_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_75_1" + file_extension);
	domDirectionalLightTest_45_75_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(75)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_75_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_75_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_90_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_90_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_90_1" + file_extension);
	domDirectionalLightTest_45_90_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_90_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_90_2" + file_extension);
	seed ++;
	domDirectionalLightTest_45_100_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_100_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_100_1" + file_extension);
	domDirectionalLightTest_45_100_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_100_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_100_2" + file_extension);
}

function generateSingleDirectionalLight60FloorSlantGlossy(choiceEnum) {
	/* generate all our stimulus ahead of time */
	amplitude = amplitude60;
	surfaceSlant = 60;

	seed ++;
	domDirectionalLightTest_60_90_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_90_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_90_1" + file_extension);
	domDirectionalLightTest_60_90_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(90)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_90_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_90_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_100_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_100_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_100_1" + file_extension);
	domDirectionalLightTest_60_100_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(100)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_100_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_100_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_110_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(110)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_110_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_110_1" + file_extension);
	domDirectionalLightTest_60_110_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(110)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_110_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_110_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_120_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(120)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_120_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_120_1" + file_extension);
	domDirectionalLightTest_60_120_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(120)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_120_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_120_2" + file_extension);
	seed ++;
	domDirectionalLightTest_60_130_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(130)], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_130_1, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_130_1" + file_extension);
	domDirectionalLightTest_60_130_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(130)], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_60_130_2, "DirectionalLightTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_130_2" + file_extension);
}

function generateMatlabLightMatte(choiceEnum) {
	/* generate all our stimulus ahead of time */

	seed ++;
	domMatlabLightTest_30_1 = generateExperimentScene( amplitude30,30, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_30_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_1" + file_extension);
	domMatlabLightTest_30_2 = generateExperimentScene( amplitude30,30, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_30_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_2" + file_extension);
	seed ++;
	domMatlabLightTest_45_1 = generateExperimentScene( amplitude45,45, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_45_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_1" + file_extension);
	domMatlabLightTest_45_2 = generateExperimentScene( amplitude45,45, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_45_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_2" + file_extension);
	seed ++;
	domMatlabLightTest_60_1 = generateExperimentScene( amplitude60,60, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_60_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_1" + file_extension);
	domMatlabLightTest_60_2 = generateExperimentScene( amplitude60,60, [getMatlabLight()], getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_60_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_2" + file_extension);
}

function generateMatlabLightGlossy(choiceEnum) {
	/* generate all our stimulus ahead of time */

	seed ++;
	domMatlabLightTest_30_1 = generateExperimentScene( amplitude30,30, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_30_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_1" + file_extension);
	domMatlabLightTest_30_2 = generateExperimentScene( amplitude30,30, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_30_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_30_2" + file_extension);
	seed ++;
	domMatlabLightTest_45_1 = generateExperimentScene( amplitude45,45, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_45_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_1" + file_extension);
	domMatlabLightTest_45_2 = generateExperimentScene( amplitude45,45, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_45_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_45_2" + file_extension);
	seed ++;
	domMatlabLightTest_60_1 = generateExperimentScene( amplitude60,60, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_60_1, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_1" + file_extension);
	domMatlabLightTest_60_2 = generateExperimentScene( amplitude60,60, [getMatlabLight()], getGlossyMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMatlabLightTest_60_2, "MatlabTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Glossy_60_2" + file_extension);
}

function generateMathematicaLightMatte(choiceEnum) {
	/* generate all our stimulus ahead of time */

	seed ++;
	domMathematicaLightTest_30_1 = generateExperimentScene( amplitude30,30, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_30_1, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_1" + file_extension);
	domMathematicaLightTest_30_2 = generateExperimentScene( amplitude30,30, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_30_2, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_30_2" + file_extension);
	seed ++;
	domMathematicaLightTest_45_1 = generateExperimentScene( amplitude45,45, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_45_1, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_1" + file_extension);
	domMathematicaLightTest_45_2 = generateExperimentScene( amplitude45,45, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_45_2, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_45_2" + file_extension);
	seed ++;
	domMathematicaLightTest_60_1 = generateExperimentScene( amplitude60,60, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_60_1, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_1" + file_extension);
	domMathematicaLightTest_60_2 = generateExperimentScene( amplitude60,60, getMathematicaLights(), getMatteMaterial(), choiceEnum, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domMathematicaLightTest_60_2, "MathematicaTest_Seed" + seed + choiceEnumString(choiceEnum) + "_Matte_60_2" + file_extension);
}

function generateSpecific(choiceEnum) {
	seed = 2111;
	amplitude = amplitude45;
	surfaceSlant = 45;

	domDirectionalLightTest_45_50_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), ChoiceEnum.VALLEY, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_50_1, "DirectionalLightTest_Seed" + seed + "Valley" + "_Matte_45_50_1" + file_extension);
	domDirectionalLightTest_45_50_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), ChoiceEnum.VALLEY, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_50_2, "DirectionalLightTest_Seed" + seed + "Valley" + "_Matte_45_50_2" + file_extension);

	domDirectionalLightTest_45_50_1 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), ChoiceEnum.HILL, generateBigRedDisk(), DISK_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_50_1, "DirectionalLightTest_Seed" + seed + "Hill" + "_Matte_45_50_1" + file_extension);
	domDirectionalLightTest_45_50_2 = generateExperimentScene( amplitude, surfaceSlant, [getDirectionalLight(50)], getMatteMaterial(), ChoiceEnum.HILL, generateSmallRedSphere(), PIP_DISTANCE, seed);
	downloadCanvas(domDirectionalLightTest_45_50_2, "DirectionalLightTest_Seed" + seed + "Hill" + "_Matte_45_50_2" + file_extension);
}

// INIT
generateSingleDirectionalLight30FloorSlantMatte(ChoiceEnum.HILL);
generateSingleDirectionalLight45FloorSlantMatte(ChoiceEnum.HILL);
generateSingleDirectionalLight60FloorSlantMatte(ChoiceEnum.HILL);
generateSingleDirectionalLight30FloorSlantGlossy(ChoiceEnum.HILL);
generateSingleDirectionalLight45FloorSlantGlossy(ChoiceEnum.HILL);
generateSingleDirectionalLight60FloorSlantGlossy(ChoiceEnum.HILL);
generateMatlabLightMatte(ChoiceEnum.HILL);
generateMatlabLightGlossy(ChoiceEnum.HILL);
generateMathematicaLightMatte(ChoiceEnum.HILL);

generateSingleDirectionalLight30FloorSlantMatte(ChoiceEnum.VALLEY);
generateSingleDirectionalLight45FloorSlantMatte(ChoiceEnum.VALLEY);
generateSingleDirectionalLight60FloorSlantMatte(ChoiceEnum.VALLEY);
generateSingleDirectionalLight30FloorSlantGlossy(ChoiceEnum.VALLEY);
generateSingleDirectionalLight45FloorSlantGlossy(ChoiceEnum.VALLEY);
generateSingleDirectionalLight60FloorSlantGlossy(ChoiceEnum.VALLEY);
generateMatlabLightMatte(ChoiceEnum.VALLEY);
generateMatlabLightGlossy(ChoiceEnum.VALLEY);
generateMathematicaLightMatte(ChoiceEnum.VALLEY);
// generateSpecific();