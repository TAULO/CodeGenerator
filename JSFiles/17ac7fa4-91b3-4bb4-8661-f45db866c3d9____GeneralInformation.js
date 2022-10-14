/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import MaterialFormStyle from '../../../style/MaterialFormStyle'
import cameraImg from '../../../assets/images/camera.jpg'
import { Controller, useForm } from 'react-hook-form'
import { SustainabilityRatingScheme } from 'reference-tables/GreenBuildingRatingSystem'
import { Redirect, useParams } from 'react-router-dom'
import BackNextGroupButton from '../../../components/BackNextGroupButton'
import StepNav from '../step-nav/StepNav'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import Countries from '../../../reference-tables/Country'
import UseType from '../../../reference-tables/UseType'
import { useRecoilState } from 'recoil'
import { addingBuildingProgressState, generalBuildingInformationState } from 'atoms'
import { makeStyles } from '@material-ui/core/styles'
import Orientation from '../../../reference-tables/Orientation'
import Period from '../../../reference-tables/Period'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Grid from '@material-ui/core/Grid'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'AuthenticateProvider'
import { trackingUser } from 'api/UserAPI'

const UploadImage = styled.div`
  width: 400px;
  margin: 0;
  border: 1px solid var(--bs-secondary);
`

const Image = styled.img`
  width: 400px;
  height: 250px;
  object-fit: cover;
`

const LeftCol = styled.div`
  max-height: calc(100vh - 333px);
  overflow: auto;
`

const Title = styled.h2`
  color: var(--bs-primary);
  font-weight: 500;
  margin-bottom: 0;
`

const GeneralInformation = () => {
  //const complexityWeight = 15

  const [generalBuildingInformation, setGeneralBuildingInformation] = useRecoilState(
    generalBuildingInformationState)

  const [addingBuildingProgress, setAddingBuildingProgressState] = useRecoilState(
    addingBuildingProgressState)

  const [latestYearForRefurbishmentOrExtension, setLatestYearForRefurbishmentOrExtension] = React.useState(
    generalBuildingInformation.latestYearForRefurbishmentOrExtension
      ? `${generalBuildingInformation.latestYearForRefurbishmentOrExtension}/01/01`
      : null,
    // new Date("2014-08-18T21:11:54")
  )

  const onHasMajorRefurbishmentOrExtensionsDoneChange = () => {
    setGeneralBuildingInformation({
      ...generalBuildingInformation,
      hasMajorRefurbishmentOrExtensionsDone: !generalBuildingInformation.hasMajorRefurbishmentOrExtensionsDone,
    })
  }

  const onLatestYearForRefurbishmentOrExtensionChange = (date) => {
    setLatestYearForRefurbishmentOrExtension(date)
    setGeneralBuildingInformation({
      ...generalBuildingInformation,
      latestYearForRefurbishmentOrExtension: date.getFullYear(),
    })
  }

  const classes = makeStyles(() => (MaterialFormStyle))()

  const [isMovingNext, setIsMovingNext] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: undefined,
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
  })

  const handleChangeBuildingPhoto = (e) => {
    e.preventDefault()
    //const formData = new FormData()
    //formData.append('image', image.raw)

    if (e.target.files.length) {
      let reader = new FileReader()
      const file = e.target.files[0]
      reader.readAsDataURL(file)
      // on reader load something...
      reader.onload = () => {
        // Make a fileInfo Object
        const base64Image = reader.result
        //.replace('data:image/png;base64,', '')
        // .replace('data:image/jpg;base64,', '')
        // .replace('data:image/jpeg;base64,', '');

        // setImage({
        //   preview: URL.createObjectURL(e.target.files[0]),
        //   raw: base64Image,
        // })

        setGeneralBuildingInformation({
          ...generalBuildingInformation,
          buildingPhoto: base64Image,
        })
      }
    }
  }

  const onInputChange = (name, value) => {
    setGeneralBuildingInformation({ ...generalBuildingInformation, [name]: value })
  }

  useEffect(() => {
    //setValue('address', generalBuildingInformation?.address, {shouldValidate: true})
    setValue('streetName', generalBuildingInformation?.streetName, { shouldValidate: true })
    setValue('streetNumber', generalBuildingInformation?.streetNumber, { shouldValidate: true })
    setValue('city', generalBuildingInformation?.city, { shouldValidate: true })
    setValue('state', generalBuildingInformation?.state, { shouldValidate: true })
    setValue('countryCode', generalBuildingInformation?.countryCode, { shouldValidate: true })
    setValue('postalCode', generalBuildingInformation?.postalCode, { shouldValidate: true })
    setValue('buildingName', generalBuildingInformation?.buildingName, { shouldValidate: true })
    setValue('constructionPeriodValue', generalBuildingInformation?.constructionPeriodValue, { shouldValidate: true })
    setValue('useTypeId', generalBuildingInformation?.useTypeId, { shouldValidate: true })
    setValue('buildingOrientedId', generalBuildingInformation?.buildingOrientedId, { shouldValidate: true })
    // setValue('sustainabilityRatingSchemeId', generalBuildingInformation?.sustainabilityRatingSchemeId)
    // setValue('sustainabilityRatingId', generalBuildingInformation?.sustainabilityRatingId)
    setValue('storeysAboveGround', generalBuildingInformation?.storeysAboveGround, { shouldValidate: true })
    setValue('storeysBelowGround', generalBuildingInformation?.storeysBelowGround, { shouldValidate: true })
    setValue('grossInteriorArea', generalBuildingInformation?.grossInteriorArea, { shouldValidate: true })
    setValue('netUsableArea', generalBuildingInformation?.netUsableArea, { shouldValidate: true })
    setValue('avgInternalFloorToCeilingHeight', generalBuildingInformation?.avgInternalFloorToCeilingHeight,
      { shouldValidate: true })
    setValue('latestYearForRefurbishmentOrExtension', generalBuildingInformation?.latestYearForRefurbishmentOrExtension,
      { shouldValidate: true })
    setValue('buildingPhoto', generalBuildingInformation?.buildingPhoto)
  }, [generalBuildingInformation, setValue])

  const { t } = useTranslation(['buildingInput', 'common'])

  useEffect(() => {
    if (generalBuildingInformation !== null &&
      generalBuildingInformation?.sustainabilityRatingSchemeId !== null) {

      setSustainabilityRating(SustainabilityRatingScheme.filter(
        item => item.id.toString() ===
          generalBuildingInformation?.sustainabilityRatingSchemeId?.toString())[0]?.ratingLevels)
    }
  }, [generalBuildingInformation, generalBuildingInformation?.sustainabilityRatingSchemeId])

  const { user } = useAuth()

  useEffect(() => {
    async function tracking() {
      const idToken = await user.getIdToken()
      trackingUser(user.uid, 'General Information - Adding Building', idToken)
    }
    tracking()
  }, [])

  const [sustainabilityRating, setSustainabilityRating] = useState(
    SustainabilityRatingScheme[0].ratingLevels)

  const { id } = useParams()
  const parentUrl = id ? `/editing-building/${id}` : '/adding-building'
  const moveNextUrl = parentUrl + (id ? '/activity' : '/activity')

  const onSubmit = () => {
    //setGeneralBuildingInformation({ ...generalBuildingInformation, ...data })
    if (!id) {
      setAddingBuildingProgressState(25)
    }
    setIsMovingNext(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isMovingNext && <Redirect to={moveNextUrl}/>}

      <div className="d-flex mt-5 mb-4">

        <Title>{t('New Building')}</Title>

        <BackNextGroupButton
          backLink={parentUrl + '/search-building'}
          nextLink={'/adding-building/activity'}
          progressValue={addingBuildingProgress}
          isDisabledSave={addingBuildingProgress < 100}
        />

      </div>

      <StepNav/>

      <div className="row">
        <LeftCol className="col-12 col-lg-8 ">

          <div className="row">

            <div className="col-12 col-lg-6">

              <Controller
                name="buildingName"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      label={t('Building Name')}
                      value={generalBuildingInformation?.buildingName}
                      onChange={(e) => {
                        onChange(e)
                        onInputChange('buildingName', e.target.value)
                      }}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
                // rules={{
                //   validate: () => {
                //     return getValues("firstName") === "bill";
                //   }
                // }}
                rules={{ required: t('This field is required') }}
              />

            </div>

            <div className="col-12 col-lg-6">

              <Controller
                name="buildingOrientedId"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="building-orientation-label" className={error && 'text-danger'}>
                      {t('Building Orientation')}
                    </InputLabel>
                    <Select labelId="building-orientation-label"
                            value={generalBuildingInformation?.buildingOrientedId}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('buildingOrientedId',
                                e.target.value)
                            }}
                            error={!!error}>
                      {Orientation.map((o) => (
                        <MenuItem
                          key={o.id}
                          value={o.id}
                        >
                          {t(o.name, {ns: "common"})}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText className="text-danger">{t('This field is required')}</FormHelperText>}
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />

            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-6">

              <Controller
                name="street-number"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="text"
                               id="street-number"
                               label={t('Building Number')}
                               value={generalBuildingInformation?.streetNumber}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('streetNumber', e.target.value)
                               }}
                               error={!!error}
                               helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />

            </div>

            <div className="col-12 col-lg-6">

              <Controller
                name="street-name"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="text"
                               id="street-name"
                               label={t('Street Name')}
                               value={generalBuildingInformation?.streetName}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('streetName', e.target.value)
                               }}
                               error={!!error}
                               helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />

            </div>

          </div>


          <div className="row">
            <div className="col-12 col-lg-6">
              <Controller
                name="postalCode"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="text"
                               label={t('Postal Code')}
                               id="postal-code"
                               value={generalBuildingInformation?.postalCode}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('postalCode',
                                   e.target.value)
                               }}
                               error={!!error}
                               helperText={error ? error.message : null}
                               aria-describedby="Postal Code"
                    />
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />
            </div>
            <div className="col-12 col-lg-6">

              <Controller
                name="sustainabilityRatingSchemeId"
                control={control}
                render={({
                  field: { onChange },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="sustainability-rating-scheme-label">{t('Sustainability Rating Scheme')}</InputLabel>
                    <Select id="sustainability-rating-scheme"
                            labelId="sustainability-rating-scheme-label"
                            value={generalBuildingInformation?.sustainabilityRatingSchemeId || ''}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange(
                                'sustainabilityRatingSchemeId',
                                e.target.value)
                            }}
                    >
                      {SustainabilityRatingScheme.map((o) => (
                        <MenuItem
                          key={o.id}
                          value={o.id}
                        >
                          {o.shortName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="city"
                control={control}
                render={({
                  field: { onChange },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="text"
                               id="city-select"
                               aria-describedby="City"
                               label={t('City')}
                               value={generalBuildingInformation?.city}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('city', e.target.value)
                               }}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="sustainabilityRatingId"
                control={control}
                render={({
                  field: { onChange },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="sustainability-rating-label">
                      {t('Sustainability Rating')}</InputLabel>
                    <Select id="sustainability-rating-select"
                            labelId="sustainability-rating-label"
                            value={generalBuildingInformation?.sustainabilityRatingId || ''}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('sustainabilityRatingId',
                                e.target.value)
                            }}
                    >
                      {sustainabilityRating.map((o) => (
                        <MenuItem
                          key={o.id}
                          value={o.id}
                        >
                          {o.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

            </div>

          </div>

          <div className="row">
            <div className="col-12 col-lg-6">
              <Controller
                name="state"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="text"
                               id="state"
                               aria-describedby="State"
                               label={t('State')}
                               value={generalBuildingInformation?.state}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('state',
                                   e.target.value)
                               }}
                               error={!!error}
                               helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="storeysAboveGround"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="number"
                               id="storeys-above-ground"
                               aria-describedby="Storeys Above Ground"
                               label={t('Storeys Above Ground')}
                               value={generalBuildingInformation?.storeysAboveGround}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('storeysAboveGround',
                                   e.target.value)
                               }}
                               min={0}
                               error={!!error}
                               helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
                rules={{
                  min: { value: 0, message: t('The value should be > -1') },
                  required: t('This field is required'),
                }}
              />

            </div>
          </div>

          <div className="row">
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="countryCode"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel className={error && 'text-danger'} id="country-code-label">
                      {t('Country')}
                    </InputLabel>
                    <Select id="country-code"
                            labelId="country-code-label"
                            value={generalBuildingInformation?.countryCode}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('countryCode',
                                e.target.value)
                            }}
                            error={!!error}
                    >
                      {Countries.map((o) => (
                        <MenuItem
                          key={o.alpha2Code}
                          value={o.alpha2Code}
                        >
                          {o.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText className="text-danger">{t('This field is required')}</FormHelperText>}
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />
            </div>
            <div className="col-12 col-lg-6">
              <Controller
                name="storeysBelowGround"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <TextField type="number"
                               id="storeys-below-ground"
                               aria-describedby="Storeys Below Ground"
                               label={t('Storeys Below Ground')}
                               value={generalBuildingInformation?.storeysBelowGround}
                               onChange={(e) => {
                                 onChange(e)
                                 onInputChange('storeysBelowGround',
                                   e.target.value)
                               }}
                               error={!!error}
                               helperText={error ? error.message : null}
                    />
                  </FormControl>
                )}
                rules={{
                  min: { value: 0, message: t('The value should be > -1') },
                  required: t('This field is required'),
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="constructionPeriodValue"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="construction-period-label" className={error && 'text-danger'}>
                      {t('Construction Period')}
                    </InputLabel>
                    <Select id="construction-period"
                            label="construction-period-label"
                            value={generalBuildingInformation?.constructionPeriodValue}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('constructionPeriodValue',
                                e.target.value)
                            }}
                            error={!!error}
                    >
                      {Period.map((o) => (
                        <MenuItem
                          key={o.id}
                          value={o.value}
                        >
                          {o.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText className="text-danger">{t('This field is required')}</FormHelperText>}
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />
            </div>

            <div
              className="d-flex justify-content-start mb-3 col-12 col-lg-6">
              <Controller
                name="grossInteriorArea"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <TextField type="number"
                             id="gross-interior-area"
                             aria-describedby="Total Floor Area Gross"
                             label={t('Total Floor Area Gross')}
                             className={classes.valueUnit}
                             value={generalBuildingInformation.grossInteriorArea}
                             onChange={(e) => {
                               onChange(e)
                               onInputChange('grossInteriorArea',
                                 e.target.value)
                             }}
                             error={!!error}
                             helperText={error ? error.message : null}
                  />
                )}
                rules={{
                  min: { value: 0, message: t('The value should be >= 0') },
                  required: t('This field is required'),
                }}
              />
              <Controller
                name="grossInteriorAreaUnit"
                control={control}
                render={({
                  field: { onChange },
                }) => (
                  <FormControl className={classes.smallFormControl}>
                    <InputLabel id="gross-interior-area-unit-label"/>
                    <Select id="gross-interior-area-unit-select"
                            labelId="gross-interior-area-unit-label"
                            className={classes.unit}
                            defaultValue="m2"
                            value={generalBuildingInformation.grossInteriorAreaUnit}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('grossInteriorAreaUnit',
                                e.target.value)
                            }}
                    >
                      <MenuItem value="m2">m<sup>2</sup></MenuItem>
                      <MenuItem value="ft2">ft<sup>2</sup></MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>

          </div>

          <div className="row">
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="useTypeId"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel id="use-type-label" className={error && 'text-danger'}>
                      {t('Use Type')}
                    </InputLabel>
                    <Select id="use-type"
                            labelId="use-type-label"
                            value={generalBuildingInformation?.useTypeId}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('useTypeId',
                                e.target.value)
                            }}
                            error={!!error}
                    >
                      {UseType.map((o) => (
                        <MenuItem
                          key={o.id}
                          value={o.id}
                        >
                          {t(o.name, {ns: 'common'})}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText className="text-danger">{t('This field is required')}</FormHelperText>}
                  </FormControl>
                )}
                rules={{ required: t('This field is required') }}
              />
            </div>
            <div
              className="col-12 col-lg-6 d-flex justify-content-start mb-3">
              <Controller
                name="netUsableArea"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (

                  <TextField type="number"
                             id="net-usable-area"
                             aria-describedby="Net Usable Area"
                             label={t('Net Usable Area')}
                             className={classes.valueUnit}
                             value={generalBuildingInformation?.netUsableArea}
                             onChange={(e) => {
                               onChange(e)
                               onInputChange('netUsableArea',
                                 e.target.value)
                             }}
                             error={!!error}
                             helperText={error ? error.message : null}
                  />

                )}
                rules={{
                  min: { value: 0, message: t('The value should be > -1') },
                  required: t('This field is required'),
                }}
              />

              <Controller
                name="netUsableAreaUnit"
                control={control}
                render={({
                  field: { onChange },
                }) => (

                  <FormControl className={classes.smallFormControl}>
                    <InputLabel id="net-usable-area-unit-label"/>
                    <Select id="net-usable-area-unit-select"
                            labelId="net-usable-area-unit-label"
                            className={classes.unit}
                            value={generalBuildingInformation?.netUsableAreaUnit}
                            onChange={(e) => {
                              onChange(e)
                              onInputChange('netUsableAreaUnit',
                                e.target.value)
                            }}
                            defaultValue="m2">
                      <MenuItem value="m2">m<sup>2</sup></MenuItem>
                      <MenuItem value="ft2">ft<sup>2</sup></MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>

          </div>

          <div className="row">
            <div className="form-group col-12 col-lg-6">
              <Controller
                name="hasMajorRefurbishmentOrExtensionsDone"
                control={control}
                render={({
                  field: { onChange },
                }) => (
                  <div className="form-group">
                    <label className="form-label d-block mb-0">{t('Has Major Refurbishment or Extension Done?')}</label>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={generalBuildingInformation.hasMajorRefurbishmentOrExtensionsDone}
                          onChange={(e) => {
                            onChange(e)
                            onHasMajorRefurbishmentOrExtensionsDoneChange(e)
                          }}
                          color="primary"
                        />
                      }
                      label={t('Yes')}
                    />
                  </div>
                )}
              />
            </div>
            <div
              className="col-12 col-lg-6 d-flex justify-content-start mb-3">
              <Controller
                name="avgInternalFloorToCeilingHeight"
                control={control}
                render={({
                  field: { onChange },
                  fieldState: { error },
                }) => (

                  <TextField type="number"
                             id="avg-internal-floor-to-ceiling-height"
                             aria-describedby="Avg. Internal Floor to Ceiling Height"
                             className={classes.valueUnit}
                             label={t('Avg. Internal Floor to Ceiling Height')}
                             value={generalBuildingInformation?.avgInternalFloorToCeilingHeight || ''}
                             onChange={(e) => {
                               onChange(e)
                               onInputChange(
                                 'avgInternalFloorToCeilingHeight',
                                 e.target.value)
                             }}
                             error={!!error}
                             helperText={error ? error.message : null}
                  />
                )}
                rules={{
                  min: { value: 0, message: t('The value should be > -1') },
                  required: t('This field is required'),
                }}
              />
              <Controller
                name="avgInternalFloorToCeilingHeightUnit"
                control={control}
                render={({
                  field: { onChange },
                }) => (

                  <FormControl className={classes.smallFormControl}>
                    <InputLabel
                      id="avg-internal-floor-to-ceiling-height-unit-label"/>
                    <Select
                      id="avg-internal-floor-to-ceiling-height-unit-select"
                      labelId="avg-internal-floor-to-ceiling-height-unit-label"
                      className={classes.unit}
                      value={generalBuildingInformation?.avgInternalFloorToCeilingHeightUnit}
                      onChange={(e) => {
                        onChange(e)
                        onInputChange(
                          'avgInternalFloorToCeilingHeightUnit',
                          e.target.value)
                      }}
                      defaultValue="m">
                      <MenuItem value="m">m</MenuItem>
                      <MenuItem value="ft">ft</MenuItem>
                    </Select>
                  </FormControl>

                )}
              />
            </div>
          </div>

          <div className="row">


            {generalBuildingInformation.hasMajorRefurbishmentOrExtensionsDone === true && (
              <div className="col-12 col-lg-6 d-flex justify-content-start mb-3">
                <Controller
                  name="latestYearForRefurbishmentOrExtension"
                  control={control}
                  render={({
                    field: { onChange },
                    fieldState: { error },
                  }) => (
                    <FormControl className={classes.formControl}>
                      <label className={error && 'text-danger'}>{t('Latest Year for Refurbishment or Extension')}</label>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justifyContent="flex-start">
                          <KeyboardDatePicker
                            maxDate={Date()}
                            variant="inline"
                            openTo="year"
                            views={['year']}
                            value={latestYearForRefurbishmentOrExtension}
                            onChange={(date) => {
                              onChange(date)
                              onLatestYearForRefurbishmentOrExtensionChange(date)
                            }}
                            error={!!error}
                            helperText={error ? error.message : null}
                          />
                        </Grid>
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  )}
                  rules={{
                    required: t('This field is required'),
                  }}
                />
              </div>
            )}

          </div>

        </LeftCol>

        <div className="col-12 col-lg-4">
          <h5>{t('Building Photo (Optional)')}</h5>
          <UploadImage>
            <label htmlFor="upload-button" title="Upload image"
                   className="w-100 h-100 d-flex overflow-hidden m-0 cursor-pointer">
              <Image src={generalBuildingInformation.buildingPhoto ?? cameraImg} alt="upload"/>
            </label>
          </UploadImage>
          <input
            type="file"
            id="upload-button"
            className="d-none"
            onChange={handleChangeBuildingPhoto}
          />
          <Controller
            name="buildingPhoto"
            control={control}
            render={({
              field: { onChange },
            }) => (
              <input
                type="hidden"
                className="d-none"
                value={generalBuildingInformation.buildingPhoto}
                onChange={(e) => {
                  onChange(e)
                  handleChangeBuildingPhoto(e)
                }}
              />
            )}
          />
          <label className="mt-3 btn btn-primary border shadow"
                 htmlFor="upload-button"
                 title="Upload image">{t('Upload Photo')}</label>
        </div>
      </div>


    </form>
  )
}

export default GeneralInformation