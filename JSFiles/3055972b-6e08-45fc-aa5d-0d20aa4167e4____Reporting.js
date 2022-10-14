import React from "react";
import Axios from "axios";
import {useSelector} from "react-redux";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputLabel from "@material-ui/core/InputLabel";
import Modal from "@material-ui/core/Modal";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {Redirect} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Reporting() {
  // styles
  const classes = useStyles();
  // states and functions
  const currentUser = useSelector(state => state.currentUser);

  const [identifier, setIdentifier] = React.useState("CS21_01_00001");
  const [performer, setPerformer] = React.useState("P30000000");
  const [sequencingType, setSequencingType] = React.useState("Target gene sequencing");
  const [targetGene, setTargetGene] = React.useState("cancer_v3.0");
  const [specimenType, setSpecimenType] = React.useState("FFPE");
  const [samplingDate, setSamplingDate] = React.useState("2021-01-01");
  const [cellline, setCellline] = React.useState("");
  const [dnaExtractionKit, setDnaExtractionKit] = React.useState("qiagen allprep DNA/RNA mini kit");
  const [od260280, setOd260280] = React.useState("1.9");
  const [od260230, setOd260230] = React.useState("2.1");
  const [dnaIntegrity, setDnaIntegrity] = React.useState("20000");
  const [libraryInputAmount, setLibraryInputAmount] = React.useState("500");
  const [libraryInsertSize, setLibraryInsertSize] = React.useState("350");
  const [libraryConstructionKit, setLibraryConstructionKit] = React.useState("agilent sureselect xt custom kit");
  const [sequencingInstrument, setSequencingInstrument] = React.useState("HiSeq2500");
  const [readLength, setReadLength] = React.useState("100");
  const [sequencingDirection, setSequencingDirection] = React.useState("Paired end sequencing");
  const [runningMode, setRunningMode] = React.useState("");
  const [errorRate, setErrorRate] = React.useState("");
  const [percentDataQualityQ30, setPercentDataQualityQ30] = React.useState("");
  const [totalReads, setTotalReads] = React.useState("10000000");
  const [meanCoverage, setMeanCoverage] = React.useState("1000");
  const [uniformity, setUniformity] = React.useState("0.9");
  const [onTargetRate, setOnTargetRate] = React.useState("0.65");
  const [q30, setQ30] = React.useState("90");
  const [prScore, setPrScore] = React.useState("90");
  const [mappingAlgorithm, setMappingAlgorithm] = React.useState("BWA-MEM (v.0.7.5)");
  const [saSoftware, setSaSoftware] = React.useState("GATK (v.3.1)");
  const [vcSoftware, setVcSoftware] = React.useState("LoFreq (v.0.6.1) | MuTect (v.2.5)");
  const [qualityScore, setQualityScore] = React.useState("");
  const [allelicReadPercentage, setAllelicReadPercentage] = React.useState("");
  const [germlineFilterCriteria, setGermlineFilterCriteria] = React.useState("0.1% > dbSNP");
  const [referenceDB, setReferenceDB] = React.useState("OncoKB DB");

  const onChangeIdentifier = (e) => {
    setIdentifier(e.target.value);
  };
  const onChangePerformer = (e) => {
    setPerformer(e.target.value);
  };
  const onChangeSequencingType = (e) => {
    setSequencingType(e.target.value);
  };
  const onChangeTargetGene = (e) => {
    setTargetGene(e.target.value);
  };
  const onChangeSpecimenType = (e) => {
    setSpecimenType(e.target.value);
  };
  const onChangeSamplingDate = (e) => {
    setSamplingDate(e.target.value);
  };
  const onChangeCellline = (e) => {
    setCellline(e.target.value);
  };
  const onChangeDnaExtractionKit = (e) => {
    setDnaExtractionKit(e.target.value);
  };
  const onChangeOd260280 = (e) => {
    setOd260280(e.target.value);
  };
  const onChangeOd260230 = (e) => {
    setOd260230(e.target.value);
  };
  const onChangeDnaIntegrity = (e) => {
    setDnaIntegrity(e.target.value);
  };
  const onChangeLibraryInputAmount = (e) => {
    setLibraryInputAmount(e.target.value);
  };
  const onChangeLibraryInsertSize = (e) => {
    setLibraryInsertSize(e.target.value);
  };
  const onChangeLibraryConstructionKit = (e) => {
    setLibraryConstructionKit(e.target.value);
  };
  const onChangeSequencingInstrument = (e) => {
    setSequencingInstrument(e.target.value);
  };
  const onChangeReadLength = (e) => {
    setReadLength(e.target.value);
  };
  const onChangeSequencingDirection = (e) => {
    setSequencingDirection(e.target.value);
  };
  const onChangeRunningMode = (e) => {
    setRunningMode(e.target.value);
  };
  const onChangeErrorRate = (e) => {
    setErrorRate(e.target.value);
  };
  const onChangePercentDataQualityQ30 = (e) => {
    setPercentDataQualityQ30(e.target.value);
  };
  const onChangeTotalReads = (e) => {
    setTotalReads(e.target.value);
  };
  const onChangeMeanCoverage = (e) => {
    setMeanCoverage(e.target.value);
  };
  const onChangeUniformity = (e) => {
    setUniformity(e.target.value);
  };
  const onChangeOnTargetRate = (e) => {
    setOnTargetRate(e.target.value);
  };
  const onChangeQ30 = (e) => {
    setQ30(e.target.value);
  };
  const onChangePrScore = (e) => {
    setPrScore(e.target.value);
  };
  const onChangeMappingAlgorithm = (e) => {
    setMappingAlgorithm(e.target.value);
  };
  const onChangeSaSoftware = (e) => {
    setSaSoftware(e.target.value);
  };
  const onChangeVcSoftware = (e) => {
    setVcSoftware(e.target.value);
  };
  const onChangeQualityScore = (e) => {
    setQualityScore(e.target.value);
  };
  const onChangeAllelicReadPercentage = (e) => {
    setAllelicReadPercentage(e.target.value);
  };
  const onChangeGermlineFilterCriteria = (e) => {
    setGermlineFilterCriteria(e.target.value);
  };
  const onChangeReferenceDB = (e) => {
    setReferenceDB(e.target.value);
  };

  const setState = () => {
    setIdentifier("");
    setPerformer("");
    setSequencingType("");
    setTargetGene("");
    setSpecimenType("");
    setSamplingDate("");
    setCellline("");
    setDnaExtractionKit("");
    setOd260280("");
    setOd260230("");
    setDnaIntegrity("");
    setLibraryInputAmount("");
    setLibraryInsertSize("");
    setLibraryConstructionKit("");
    setSequencingInstrument("");
    setReadLength("");
    setSequencingDirection("");
    setRunningMode("");
    setErrorRate("");
    setPercentDataQualityQ30("");
    setTotalReads("");
    setMeanCoverage("");
    setUniformity("");
    setOnTargetRate("");
    setQ30("");
    setPrScore("");
    setMappingAlgorithm("");
    setSaSoftware("");
    setVcSoftware("");
    setQualityScore("");
    setAllelicReadPercentage("");
    setGermlineFilterCriteria("");
    setReferenceDB("");
  };

  let reportObj = {
    resourceType: "MolecularSequence",
    id: "0",
    extension: [
      {
        url: "http://example.org/fhir/StructureDefinition/QcMetrics",
        extension: [
          {
            url: "sequencingType",
            extension: [
              {
                url: "sequencingType",
                valueString: "",
              },
              {
                url: "targetGene",
                valueString: "",
              },
            ],
          },
          {
            url: "sampleInformation",
            extension: [
              {
                url: "specimenType",
                valueString: "",
              },
              {
                url: "samplingDate",
                valueDate: "",
              },
              {
                url: "cellline",
                valueString: "",
              },
            ],
          },
          {
            url: "dnaExtraction",
            extension: [
              {
                url: "dnaExtractionKit",
                valueString: "",
              },
              {
                url: "dnaPurity",
                extension: [
                  {
                    url: "od260280",
                    valueDecimal: "",
                  },
                  {
                    url: "od260230",
                    valueDecimal: "",
                  },
                ],
              },
              {
                url: "dnaIntegrity",
                valueDecimal: "",
              },
            ],
          },
          {
            url: "libraryConstruction",
            extension: [
              {
                url: "libraryInputAmount",
                valueDecimal: "",
              },
              {
                url: "libraryInsertSize",
                valueDecimal: "",
              },
              {
                url: "libraryConstructionKit",
                valueString: "",
              },
            ],
          },
          {
            url: "sequencingInformation",
            extension: [
              {
                url: "sequenceInstrument",
                valueString: "",
              },
              {
                url: "readLength",
                valueDecimal: "",
              },
              {
                url: "sequencingDirection",
                valueString: "",
              },
              {
                url: "runningMode",
                valueString: "",
              },
            ],
          },
          {
            url: "runningQuality",
            extension: [
              {
                url: "errorRate",
                valueDecimal: "",
              },
              {
                url: "percentDataQualityQ30",
                valueDecimal: "",
              },
            ],
          },
          {
            url: "dataQuality",
            extension: [
              {
                url: "totalReads",
                valueDecimal: "",
              },
              {
                url: "meanCoverage",
                valueDecimal: "",
              },
              {
                url: "uniformity",
                valueDecimal: "",
              },
              {
                url: "onTargetRate",
                valueDecimal: "",
              },
              {
                url: "q30",
                valueDecimal: "",
              },
              {
                url: "prScore",
                valueDecimal: "",
              },
            ],
          },
          {
            url: "sequencingAlignment",
            extension: [
              {
                url: "mappingAlgorithm",
                valueString: "",
              },
              {
                url: "software",
                valueString: "",
              },
            ],
          },
          {
            url: "variantCalling",
            extension: [
              {
                url: "software",
                valueString: "",
              },
              {
                url: "qualityScore",
                valueDecimal: "",
              },
              {
                url: "allelicReadPercentage",
                valueDecimal: "",
              },
            ],
          },
          {
            url: "variantFilteringAndAnnotation",
            extension: [
              {
                url: "germlineFilterCriteria",
                valueString: "",
              },
              {
                url: "referenceDB",
                valueString: "",
              },
            ],
          },
        ],
      },
    ],
    identifier: [
      {
        system: "",
        value: "",
      },
    ],
    type: "dna",
    coordinateSystem: 1,
  };

  reportObj.extension[0].extension[0].extension[0].valueString = sequencingType;
  reportObj.extension[0].extension[0].extension[1].valueString = targetGene;
  reportObj.extension[0].extension[1].extension[0].valueString = specimenType;
  reportObj.extension[0].extension[1].extension[1].valueDate = samplingDate;
  reportObj.extension[0].extension[1].extension[2].valueString = cellline;
  reportObj.extension[0].extension[2].extension[0].valueString = dnaExtractionKit;
  reportObj.extension[0].extension[2].extension[1].extension[0].valueDecimal = od260280;
  reportObj.extension[0].extension[2].extension[1].extension[1].valueDecimal = od260230;
  reportObj.extension[0].extension[2].extension[2].valueDecimal = dnaIntegrity;
  reportObj.extension[0].extension[3].extension[0].valueDecimal = libraryInputAmount;
  reportObj.extension[0].extension[3].extension[1].valueDecimal = libraryInsertSize;
  reportObj.extension[0].extension[3].extension[2].valueString = libraryConstructionKit;
  reportObj.extension[0].extension[4].extension[0].valueString = sequencingInstrument;
  reportObj.extension[0].extension[4].extension[1].valueDecimal = readLength;
  reportObj.extension[0].extension[4].extension[2].valueString = sequencingDirection;
  reportObj.extension[0].extension[4].extension[3].valueString = runningMode;
  reportObj.extension[0].extension[5].extension[0].valueDecimal = errorRate;
  reportObj.extension[0].extension[5].extension[1].valueDecimal = percentDataQualityQ30;
  reportObj.extension[0].extension[6].extension[0].valueDecimal = totalReads;
  reportObj.extension[0].extension[6].extension[1].valueDecimal = meanCoverage;
  reportObj.extension[0].extension[6].extension[2].valueDecimal = uniformity;
  reportObj.extension[0].extension[6].extension[3].valueDecimal = onTargetRate;
  reportObj.extension[0].extension[6].extension[4].valueDecimal = q30;
  reportObj.extension[0].extension[6].extension[5].valueDecimal = prScore;
  reportObj.extension[0].extension[7].extension[0].valueString = mappingAlgorithm;
  reportObj.extension[0].extension[7].extension[1].valueString = saSoftware;
  reportObj.extension[0].extension[8].extension[0].valueString = vcSoftware;
  reportObj.extension[0].extension[8].extension[1].valueDecimal = qualityScore;
  reportObj.extension[0].extension[8].extension[2].valueDecimal = allelicReadPercentage;
  reportObj.extension[0].extension[9].extension[0].valueString = germlineFilterCriteria;
  reportObj.extension[0].extension[9].extension[1].valueString = referenceDB;
  reportObj.identifier[0].value = identifier;
  reportObj.identifier[0].system = `http://129.150.178.10:8080/qms/${performer}`;

  let reportJson = JSON.stringify(reportObj);

  const url = `https://skku-milab.ddns.net:9080/fhir/MolecularSequence`
  // const url = `https://skku-milab.ddns.net:9080/fhir/MolecularSequence`
  // const url = `http://192.168.0.129:9080/fhir/MolecularSequence`
  let token = ""

  // Temporary
  currentUser.login = 'LOG_IN'
  // if (currentUser.login) {
  //   token = currentUser.user.access_token.value
  // }
  // Temporary

  const config = {
    headers: {
      "Content-Type": "application/fhir+json",
      // Authorization: `Bearer ${token}`,
    },
    // withCredentials: true
  };
  const fetchData = async () => {
    await Axios
      .post(url, reportJson, config)
      .then(async response => {
        if (response.status === 200) {
          await setState();
          console.log("Returned data: ", response);
        } else {
          console.log('error');
        }
      })
      .catch(err => {
        console.log('Error: ', err);
      });
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickSubmit = () => {
    fetchData().then(r => {
      console.log("Send data")
    });
  };

  return (
    <div>
      {
      //   !currentUser.login ? (
      //   <div>
      //     <Redirect to="/admin/login"/>
      //   </div>
      // ) : (
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>
                  Clinical NGS LAB Reporting
                </h4>
                <p className={classes.cardCategoryWhite}>
                  w/ Quality Control Information
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <InputLabel style={{color: "primary"}}>
                      Recipient
                    </InputLabel>
                    <CustomInput
                      labelText="Destination: S Hospital (disabled)"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>Order ID</InputLabel>
                    <CustomInput
                      labelText="Order ID"
                      id="identifier"
                      value={identifier}
                      // error={identifier === "" ? true : false}
                      onChange={onChangeIdentifier}
                      formControlProps={{
                        fullWidth: true,
                      }}
                      required="true"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Performer
                    </InputLabel>
                    <CustomInput
                      labelText="Performer"
                      id="performer"
                      value={performer}
                      onChange={onChangePerformer}
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        required: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Sequencing Type
                    </InputLabel>
                    <CustomInput
                      labelText="Sequencing type"
                      id="sequencingType"
                      value={sequencingType}
                      onChange={onChangeSequencingType}
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        required: true,
                      }}
                    />
                    <CustomInput
                      labelText="Target gene"
                      id="targetGene"
                      defaultValue=""
                      value={targetGene}
                      onChange={onChangeTargetGene}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Sample Information
                    </InputLabel>
                    <CustomInput
                      labelText="Specimen type"
                      id="specimenType"
                      value={specimenType}
                      onChange={onChangeSpecimenType}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Sampling date"
                      id="samplingDate"
                      value={samplingDate}
                      onChange={onChangeSamplingDate}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Cell line"
                      id="cellline"
                      value={cellline}
                      onChange={onChangeCellline}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      DNA Extraction
                    </InputLabel>
                    <CustomInput
                      labelText="DNA extraction kit"
                      id="dnaExtractionKit"
                      value={dnaExtractionKit}
                      onChange={onChangeDnaExtractionKit}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="DNA purity (OD 260/280)"
                      id="od260280"
                      value={od260280}
                      onChange={onChangeOd260280}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="DNA purity (OD 260/230)"
                      id="od260230"
                      value={od260230}
                      onChange={onChangeOd260230}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="DNA integrity"
                      id="dnaIntegrity"
                      value={dnaIntegrity}
                      onChange={onChangeDnaIntegrity}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Library Construction
                    </InputLabel>
                    <CustomInput
                      labelText="Library input amount"
                      id="libraryInputAmount"
                      value={libraryInputAmount}
                      onChange={onChangeLibraryInputAmount}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Library insert size"
                      id="libraryInsertSize"
                      value={libraryInsertSize}
                      onChange={onChangeLibraryInsertSize}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Library construction kit"
                      id="libraryConstructionKit"
                      value={libraryConstructionKit}
                      onChange={onChangeLibraryConstructionKit}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Sequencing Information
                    </InputLabel>
                    <CustomInput
                      labelText="Sequencing instrument"
                      id="sequencingInstrument"
                      value={sequencingInstrument}
                      onChange={onChangeSequencingInstrument}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Read length"
                      id="readLength"
                      value={readLength}
                      onChange={onChangeReadLength}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Sequencing direction"
                      id="sequencingDirection"
                      value={sequencingDirection}
                      onChange={onChangeSequencingDirection}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Running mode"
                      id="runningMode"
                      value={runningMode}
                      onChange={onChangeRunningMode}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Running Quality
                    </InputLabel>
                    <CustomInput
                      labelText="Error rate"
                      id="errorRate"
                      value={errorRate}
                      onChange={onChangeErrorRate}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Percent data quality (>Q30)"
                      id="percentDataQualityQ30"
                      value={percentDataQualityQ30}
                      onChange={onChangePercentDataQualityQ30}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Data Quality
                    </InputLabel>
                    <CustomInput
                      labelText="Total reads"
                      id="totalReads"
                      value={totalReads}
                      onChange={onChangeTotalReads}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Mean coverage"
                      id="meanCoverage"
                      value={meanCoverage}
                      onChange={onChangeMeanCoverage}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Uniformity"
                      id="uniformity"
                      value={uniformity}
                      onChange={onChangeUniformity}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="On target rate"
                      id="onTargetRate"
                      value={onTargetRate}
                      onChange={onChangeOnTargetRate}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Q30"
                      id="q30"
                      value={q30}
                      onChange={onChangeQ30}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="PRScore"
                      id="prScore"
                      value={prScore}
                      onChange={onChangePrScore}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Sequencing Alignment
                    </InputLabel>
                    <CustomInput
                      labelText="Mapping algorithm"
                      id="mappingAlgorithm"
                      value={mappingAlgorithm}
                      onChange={onChangeMappingAlgorithm}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Sequencing alignment software"
                      id="saSoftware"
                      value={saSoftware}
                      onChange={onChangeSaSoftware}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Valiant Calling
                    </InputLabel>
                    <CustomInput
                      labelText="Valiant calling software"
                      id="vcSoftware"
                      value={vcSoftware}
                      onChange={onChangeVcSoftware}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Quality score"
                      id="qualityScore"
                      value={qualityScore}
                      onChange={onChangeQualityScore}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Allelic read percentage"
                      id="allelicReadPercentage"
                      value={allelicReadPercentage}
                      onChange={onChangeAllelicReadPercentage}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <InputLabel style={{color: "primary"}}>
                      Variant Filtering and Annotation
                    </InputLabel>
                    <CustomInput
                      labelText="Germline filter criteria"
                      id="germlineFilterCriteria"
                      value={germlineFilterCriteria}
                      onChange={onChangeGermlineFilterCriteria}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                    <CustomInput
                      labelText="Reference DB"
                      id="referenceDB"
                      value={referenceDB}
                      onChange={onChangeReferenceDB}
                      formControlProps={{
                        fullWidth: true,
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="success" onClick={handleOpen}>
                  Preview JSON file
                </Button>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  className={classes.modal}
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={open}>
                    <div className={classes.paper}>
                      <h2 id="transition-modal-title">JSON</h2>
                      <p id="transition-modal-description">{reportJson}</p>
                    </div>
                  </Fade>
                </Modal>
                <Button color="info" onClick={onClickSubmit}>
                  Send
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>Preview of the report</h4>
                <p className={classes.cardCategoryWhite}>
                  Please check all the information before you send
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4
                      className={classes.description}
                      style={{display: "inline"}}
                    >
                      Recipient: &nbsp;
                    </h4>
                    <h4
                      className={classes.description}
                      style={{color: "#AAAAAA", display: "inline-block"}}
                    >
                      S Hospital
                    </h4>
                    <br/>

                    <h4
                      className={classes.description}
                      style={{display: "inline"}}
                    >
                      Order ID: &nbsp;
                    </h4>
                    <h4
                      className={classes.description}
                      style={{color: "#AAAAAA", display: "inline-block"}}
                    >
                      {identifier ? identifier : "empty"}
                    </h4>
                    <br/>

                    <h4
                      className={classes.description}
                      style={{display: "inline"}}
                    >
                      Performer: &nbsp;
                    </h4>
                    <h4
                      className={classes.description}
                      style={{color: "#AAAAAA", display: "inline-block"}}
                    >
                      {performer ? performer : "empty"}
                    </h4>
                    <br/>

                    <h4 className={classes.description}>Sequencing Type</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Sequencing Type: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {sequencingType ? sequencingType : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Target Gene: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {targetGene ? targetGene : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Sample Information</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Specimen Type: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {specimenType ? specimenType : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Sampling Date: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {samplingDate ? samplingDate : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Cell Line: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {cellline ? cellline : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>DNA Extraction</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        DNA Extraction Kit: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {dnaExtractionKit ? dnaExtractionKit : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        DNA Purity (OD 260/280): &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {od260280 ? od260280 : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        DNA Purity (OD 260/230): &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {od260230 ? od260230 : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        DNA Integrity: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {dnaIntegrity ? dnaIntegrity : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Library Construction</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Library Input Amount: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {libraryInputAmount ? libraryInputAmount : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Library Input Size: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {libraryInsertSize ? libraryInsertSize : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Library Construction Kit: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {libraryConstructionKit
                          ? libraryConstructionKit
                          : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Sequencing Information</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Sequencing Instrument: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {sequencingInstrument ? sequencingInstrument : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Read Length: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {readLength ? readLength : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Sequencing Direction: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {sequencingDirection ? sequencingDirection : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Running Mode: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {runningMode ? runningMode : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Running Quality</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Error Rate: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {errorRate ? errorRate : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Percent Data Quality (>Q30) &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {percentDataQualityQ30 ? percentDataQualityQ30 : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Data Quality</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Total Reads: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {totalReads ? totalReads : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Mean Coverage: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {meanCoverage ? meanCoverage : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Uniformity: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {uniformity ? uniformity : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        On Target Rate: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {onTargetRate ? onTargetRate : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Q30: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {q30 ? q30 : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        PR Score: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {prScore ? prScore : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Sequencing Alignment</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Mapping Algorithm: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {mappingAlgorithm ? mappingAlgorithm : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Sequencing Alignment Software: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {saSoftware ? saSoftware : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>Variant Calling</h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Variant Calling Software: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {vcSoftware ? vcSoftware : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Quality Score: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {qualityScore ? qualityScore : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Allelic Read Percentage: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {allelicReadPercentage ? allelicReadPercentage : "empty"}
                      </h6>
                    </li>
                    <br/>

                    <h4 className={classes.cardTitle}>
                      Variant Filtering and Annotation
                    </h4>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Germline Filter Criteria: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {germlineFilterCriteria
                          ? germlineFilterCriteria
                          : "empty"}
                      </h6>
                    </li>
                    <li>
                      <h6
                        className={classes.description}
                        style={{display: "inline"}}
                      >
                        Reference DB: &nbsp;
                      </h6>
                      <h6
                        className={classes.description}
                        style={{color: "#AAAAAA", display: "inline"}}
                      >
                        {referenceDB ? referenceDB : "empty"}
                      </h6>
                    </li>
                    <br/>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      // )
      }
    </div>
  );
}
