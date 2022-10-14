import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import {
  APP_FONTS,
  APP_THEME,
  APP_ROUTE,
  google_maps_geocoding_api_endpoint
} from '../../../../constants';
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';
import { labels } from '../../../../stringConstants';
import ModalDropdown from 'react-native-modal-dropdown';
import {
  createNewObject,
  API_NAME,
  API_END_POINT,
  SyncPinPriority,
  API_JTI_CUSTOMER_API,
  fetchObjectCollection
} from '../../../../services/omcClient';
import { pick, split, get } from 'lodash';
import Loader from '../../../../components/common/Loader';
import { randomString } from '../../../../utility';
import { find, findIndex } from 'lodash';
import RuleEngine from 'node-rules';
//import { Engine } from 'json-rules-engine';
import JSONfn from 'json-fn';

import validationRules from './rules.json';

import { Click, validateObject } from './Observer';

class CustomerInfo extends PureComponent {
  click = new Click();
  state = {
    customer: {
      id: '',
      pricebookid: '',
      routeid: '',
      name: '',
      comment: '',
      registrationtype: '',
      shopsize: '',
      clusterpriority: '',
      OrganizationDEO_JTI_PromotionAcceptanceRatio_c: '',
      primaryaddress: {
        addressid: '',
        street: '',
        city: '',
        country: '',
        additional: '',
        postalcode: '',
        state: ''
      },
      primarycontact: {
        contactid: '',
        firstname: '',
        lastname: '',
        countrycode: '',
        phone: '',
        alternatephone: '',
        email: '',
        primary: 'true'
      },
      address: [],
      contacts: [],
      extension: []
    },
    Contact: [],
    edit: false,
    loading: false,
    uuid: `${'A#'}${randomString(20)}`
  };

  onSaveHandler = async data => {
    // const {
    //   auth: { profile },
    //   navigation: {
    //     state: { params }
    //   }
    // } = this.props;
    // let SourceSystem = '';
    // if (params && params.customer) {
    //   SourceSystem = params.customer.SourceSystem;
    // }

    console.log('accountData', data);

    if (data.contacts) {
      data = { ...data, contacts: JSONfn.stringify(data.contacts) };
    }

    if (data.address) {
      data = { ...data, address: JSONfn.stringify(data.address) };
    }

    if (data.extension) {
      data = { ...data, extension: JSONfn.stringify(data.extension) };
    }

    console.log('accountData', data);

    try {
      this.setState({ loading: true });
      const response = await createNewObject(
        data,
        API_JTI_CUSTOMER_API,
        API_END_POINT.CUSTOMERS,
        'id',
        SyncPinPriority.High
      );
      this.setState({ loading: false });
      if (response && response.success) {
        this.setState({ loading: false });
        this.goBack();
      }
      return Promise.resolve();
    } catch (error) {
      {
        this.setState({ loading: false });
        setTimeout(() => {
          if (error.message) {
            Alert.alert('', error.message);
          } else {
            Alert.alert('', error);
          }
        }, 200);
        return Promise.reject();
      }
    }

    // accountData = {
    //   ...accountData,
    //   OrganizationDEO___ORACO__PriceBook_Id_c: priceBookId,
    //   OrganizationDEO___ORACO__PriceBook_c: priceBookName,
    //   OrganizationDEO_JTI_AccountStatus_c: 'Active',
    //   OwnerPartyNumber: profile.PartyNumber
    // };

    // var diffrentiatorKey = 'PartyNumber';

    // if (this.state.customer.PartyNumber) {
    //   accountData = {
    //     ...accountData,
    //     PartyNumber: this.state.customer.PartyNumber
    //   };
    // } else if (SourceSystem.length > 0) {
    //   accountData = {
    //     ...accountData
    //   };
    //   diffrentiatorKey = 'SourceSystem';
    // } else {
    //   diffrentiatorKey = 'SourceSystem';
    //   accountData = {
    //     ...accountData,
    //     SourceSystem: this.state.uuid,
    //     SourceSystemReferenceValue: ''
    //   };
    // }
    // this.setState({ loading: true });
    // try {
    //   const response = await createNewObject(
    //     accountData,
    //     API_NAME,
    //     API_END_POINT.ACCOUNT,
    //     diffrentiatorKey,
    //     SyncPinPriority.High
    //   );
    //   this.setState({ loading: false });
    //   if (response && response.success) {
    //     const { PartyNumber } = response.object;
    //     if (this.state.customer.PrimaryContactName) {
    //       this.createContact(PartyNumber);
    //     } else {
    //       this.setState({ loading: false });
    //       this.goBack();
    //     }
    //   }
    // } catch (error) {
    //   {
    //     this.setState({ loading: false });
    //     setTimeout(() => {
    //       Alert.alert('', labels.ACCOUNT_NOT_CREATED);
    //     }, 200);
    //   }
    // }
  };

  getContactDetails = contacts => {
    const contact = find(contacts, contacts => contacts.primary == 'true');
    if (contact && Object.keys(contact).length > 0) {
      return contact;
    } else {
      return {
        phone: 'N/A',
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        PartyNumber: '',
        countrycode: '',
        primary: '',
        extension: '',
        alternatephone: ''
      };
    }
  };
  componentDidMount() {
    const {
      navigation: {
        state: { params }
      },
      auth: { profile }
    } = this.props;

    this.checkNetworkConnectivity();

    if (params && params.customer) {
      const contact = find(
        params.customer.contacts,
        contacts => contacts.primary == 'true'
      );

      const address = find(
        params.customer.address,
        address => address.primary == 'true' || address.primary
      );

      const acceptanceratio = find(
        params.customer.extension,
        ext => ext.name == 'acceptanceratio'
      );

      const clusterpriority = find(
        params.customer.extension,
        ext => ext.name == 'clusterpriority'
      );

      this.setState({
        customer: {
          ...params.customer,
          primaryaddress: address
            ? address
            : {
                addressid: '',
                street: '',
                city: '',
                country: '',
                additional: '',
                postalcode: '',
                state: ''
              },
          primarycontact: contact
            ? contact
            : {
                contactid: '',
                firstname: '',
                lastname: '',
                countrycode: '',
                phone: '',
                alternatephone: '',
                email: '',
                primary: ''
              },
          clusterpriority: clusterpriority ? clusterpriority.value : '',
          OrganizationDEO_JTI_PromotionAcceptanceRatio_c: acceptanceratio
            ? acceptanceratio.value
            : ''
        }
      });
    } else {
      const customer = this.state.customer;
      this.setState({
        customer: {
          ...customer,
          registrationtype:
            profile.PrimaryCountry_c == 'CA' ? 'Wholesaler' : 'Tobacconist',
          primaryaddress: {
            ...customer.primaryaddress,
            country: profile.PrimaryCountry_c == 'CA' ? 'CA' : 'IE'
          },
          clusterpriority: profile.PrimaryCountry_c == 'CA' ? 'Low' : ''
        }
      });
    }

    // if (params && params.customer && params.customer.contact) {
    //   //Name,email
    //   const {
    //     FirstName,
    //     LastName,
    //     MiddleName,
    //     EmailAddress,
    //     JobTitle,
    //     MobileNumber
    //   } = params.customer.contact;

    //   this.setState({
    //     customer: {
    //       ...params.customer,
    //       PrimaryContactEmail: EmailAddress,
    //       PrimaryContactName: `${FirstName} ${MiddleName} ${LastName}`,
    //       PrimaryJobTitle: JobTitle,
    //       PrimaryContactPhone: MobileNumber
    //     }
    //   });
    // }

    // this.setState({
    //   OrganizationDEO___ORACO__PriceBook_c:
    //     profile.__ORACO__DistributionCentre_c
    // });

    if (params && params.edit) {
      this.setState({ edit: params.edit });
    }

    this.click.subscribe('validate', validateObject);
  }

  componentWillReceiveProps(newProps) {
    const {
      customers: { contact }
    } = newProps;
    if (contact) {
      this.setState({ contact: contact });
    }
  }

  onEditHandler = () => {
    const { OrganizationName } = this.state.customer;
    const { navigation } = this.props;

    navigation.navigate(APP_ROUTE.CUSTOMER_EDIT, {
      customer: this.state.customer,
      edit: true,
      headerTitle: OrganizationName || labels.CUSTOMERS
    });
  };

  goBack = () => {
    const { customersActions } = this.props;
    customersActions.reloadCustomer(true);
    customersActions.getAllCustomers();
    const { navigation } = this.props;
    if (this.state.edit) {
      navigation.navigate(APP_ROUTE.CUSTOMERS_ALL);
    } else {
      navigation.goBack();
    }
    //navigation.goBack();
  };

  validateRequest = () => {
    const {
      name,
      primarycontact: { email, firstname },
      registrationtype,
      primaryaddress: { additional, country },
      shopsize
    } = this.state.customer;
    let isValid = true;
    let errorMessage = '';
    if (!name) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.ORGANISATION_NAME_VALIDATION;
    }
    if (!registrationtype) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.ACCOUNT_TYPE_VALIDATION;
    }
    if (!additional) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.ADDRESS_LINE1_VALIDATION;
    }
    if (registrationtype === 'Wholesaler' && !shopsize) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.SHOP_SIZE_MANDATORY;
    }
    if (!country) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.ADDRESS_COUNTRY_VALIDATION;
    }
    if (!firstname) {
      isValid = false;
      errorMessage =
        errorMessage + '\n' + labels.CONTACT_PERSON_NAME_VALIDATION;
    }
    if (!email) {
      isValid = false;
      errorMessage = errorMessage + '\n' + labels.EMAIL_VALIDATION;
    }

    // if (Country && 'Country' == 'IE' && !OrganizationDEO_JTI_ShopSize_c) {
    //   isValid = false;
    //   errorMessage = errorMessage + '\n' + labels.SHOP_SIZE_VALIDATION;
    // }

    if (!isValid) {
      Alert.alert(labels.NEW_CUSTOMER, errorMessage, [{ text: labels.OK }], {
        cancelable: false
      });
    }

    return isValid;
  };

  onFailHandler = error => {
    console.log('error on rule');
    console.log(error);
    alert(error);
  };

  onCustomerSaveClick = async () => {
    const {
      auth: { profile },
      navigation: {
        state: { params }
      }
    } = this.props;
    let SourceSystem = '';
    if (params && params.customer) {
      SourceSystem = params.customer.SourceSystem;
    }

    let accountData = pick(this.state.customer, [
      'id',
      'name',
      'registrationtype',
      'comment',
      'shopsize',
      'externalid',
      'pricebookid',
      'address',
      'contacts',
      'extension'
    ]);

    const {
      primaryaddress,
      primarycontact,
      clusterpriority,
      OrganizationDEO_JTI_PromotionAcceptanceRatio_c
    } = this.state.customer;

    if (isEmpty(accountData.address)) {
      if (!primaryaddress.addressid) delete primaryaddress.addressid;
      accountData.address.push(primaryaddress);
    } else {
      const indexAddress = findIndex(
        accountData.address,
        address => address.addressid == primaryaddress.addressid
      );

      if (indexAddress != -1) {
        if (!primaryaddress.addressid) delete primaryaddress.addressid;
        accountData.address[indexAddress] = primaryaddress;
      } else {
        accountData.address = [];
        if (!primaryaddress.addressid) delete primaryaddress.addressid;
        accountData.address.push(primaryaddress);
      }
    }

    if (isEmpty(accountData.contacts)) {
      if (!primarycontact.contactid) delete primarycontact.contactid;
      accountData.contacts.push(primarycontact);
    } else {
      const indexContact = findIndex(
        accountData.contacts,
        contacts => contacts.contactid == primarycontact.contactid
      );

      if (indexContact != -1) {
        if (!primarycontact.contactid) delete primarycontact.contactid;
        accountData.contacts[indexContact] = primarycontact;
      }
    }

    if (isEmpty(accountData.extension)) {
      if (clusterpriority) {
        accountData.extension.push({
          name: 'clusterpriority',
          value: clusterpriority
        });
      }
      if (OrganizationDEO_JTI_PromotionAcceptanceRatio_c) {
        accountData.extension.push({
          name: 'acceptanceratio',
          value: OrganizationDEO_JTI_PromotionAcceptanceRatio_c
        });
      }
    } else {
      const indexClusterpriority = findIndex(
        accountData.extension,
        extension => extension.name == 'clusterpriority'
      );

      if (indexClusterpriority != -1) {
        accountData.extension[indexClusterpriority] = {
          name: 'clusterpriority',
          value: clusterpriority
        };
      }

      const indexAcceptanceratio = findIndex(
        accountData.extension,
        extension => extension.name == 'acceptanceratio'
      );

      if (indexAcceptanceratio != -1) {
        accountData.extension[indexAcceptanceratio] = {
          name: 'acceptanceratio',
          value: OrganizationDEO_JTI_PromotionAcceptanceRatio_c
        };
      }
    }
    const endPoint = `${API_END_POINT.PRICE_BOOK_HEADER}?Name=${
      profile.__ORACO__DistributionCentre_c
    }`;

    const priceBookResponse = await fetchObjectCollection(API_NAME, endPoint);
    if (priceBookResponse && priceBookResponse.length > 0) {
      accountData = {
        ...accountData,
        pricebookid: '' + priceBookResponse[0].PricebookId
      };
    }

    //  this.onSaveHandler(accountData);

    this.click.fire('validate', {
      object: 'Customer',
      data: accountData,
      onSuccessHandler: this.onSaveHandler,
      onFailHandler: this.onFailHandler
    });
  };

  getGeocodedAddress = () => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const geocodingResults = await fetch(
            `${google_maps_geocoding_api_endpoint}?latlng=${
              position.coords.latitude
            },${position.coords.longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const geocodingResultsBody = await geocodingResults.json();
          const geocodingResult =
            geocodingResultsBody.results[0].address_components;
          this.setState(prevState => ({
            customer: {
              ...prevState.customer,
              AddressLine1: `${this.getItemFromGeocodingResults(
                geocodingResult,
                'sublocality'
              )} ${this.getItemFromGeocodingResults(
                geocodingResult,
                'locality'
              )}`,
              City: `${this.getItemFromGeocodingResults(
                geocodingResult,
                'administrative_area_level_2'
              )}`,
              Province: `${this.getItemFromGeocodingResults(
                geocodingResult,
                'administrative_area_level_1'
              )}`,
              County: `${this.getItemFromGeocodingResults(
                geocodingResult,
                'administrative_area_level_1'
              )}`,
              PostalCode: `${this.getItemFromGeocodingResults(
                geocodingResult,
                'postal_code'
              )}`
            }
          }));
        } catch (error) {
          this.handleGeocodingError(error);
        }
      },
      error => this.handleGeocodingError(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  getItemFromGeocodingResults(result, key) {
    const filteredAddress = result.find(item => item.types.includes(key));
    if (filteredAddress) {
      return filteredAddress.long_name;
    }
    return '';
  }

  handleGeocodingError(error) {
    console.log(error);
    setTimeout(() => {
      Alert.alert('', labels.error_fetch_device_location);
    }, 200);
  }

  getContactName = () => {
    const {
      PrimaryContactName,
      PrimaryContactEmail,
      PrimaryJobTitle,
      PrimaryContactPhone
    } = this.state.customer;
    const contact = {
      FirstName: '',
      LastName: '',
      MiddleName: '',
      JobTitle: PrimaryJobTitle ? PrimaryJobTitle : '',
      EmailAddress: PrimaryContactEmail ? PrimaryContactEmail : '',
      MobileNumber: PrimaryContactPhone ? PrimaryContactPhone : ''
    };

    if (PrimaryContactName) {
      const name = split(PrimaryContactName, ' ');
      contact['FirstName'] = name[0];
      if (name.length > 2) {
        contact['MiddleName'] = name[1];
        contact['LastName'] = name[2];
      } else if (name.length > 1) {
        contact['LastName'] = name[1];
      }
    }

    return contact;
  };

  createContact = async PartyNumber => {
    const address = pick(this.state.customer, [
      'Country',
      'AddressLine1',
      'AddressLine2',
      'AddressLine3',
      'City',
      'Province',
      'PostalCode',
      'County',
      'OwnerPartyNumber',
      'SourceSystem',
      'SourceSystemReferenceValue'
    ]);

    const systemExternalKeys = pick(this.state.customer.contact, [
      'SourceSystem',
      'SourceSystemReferenceValue'
    ]);

    const name = this.getContactName();

    const {
      auth: { profile },
      navigation: {
        state: { params }
      }
    } = this.props;

    let SourceSystemReferenceValue = '';
    if (params && params.customer && params.customer.contact) {
      SourceSystemReferenceValue =
        params.customer.contact.SourceSystemReferenceValue;
    }

    var contact = {
      ...address,
      ...name,
      ...systemExternalKeys,
      AccountPartyNumber: PartyNumber,
      OwnerPartyNumber: profile.PartyNumber
    };

    var diffrentiatorKey = 'PartyNumber';

    if (this.state.customer.PrimaryContactPartyNumber) {
      contact = {
        ...contact,
        PartyNumber: this.state.customer.PrimaryContactPartyNumber
      };
    } else if (SourceSystemReferenceValue.length > 0) {
      contact = {
        ...contact
      };
      diffrentiatorKey = 'SourceSystemReferenceValue';
    } else {
      diffrentiatorKey = 'SourceSystemReferenceValue';
      contact = {
        ...contact,
        SourceSystem: '',
        SourceSystemReferenceValue: this.state.uuid
      };
    }
    this.setState({ loading: true });
    try {
      await createNewObject(
        contact,
        API_NAME,
        API_END_POINT.CONTACT,
        diffrentiatorKey,
        SyncPinPriority.Normal
      );
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.showSuccessMessage();
        }, 200);
      });
    } catch (error) {
      {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            Alert.alert(
              '',
              labels.CONTACT_NOT_CREATED,
              [
                {
                  text: 'Try Again',
                  onPress: () => {
                    this.createContact(PartyNumber);
                  }
                },
                {
                  text: 'Cancel',
                  onPress: () => this.goBack(),
                  style: 'cancel'
                }
              ],
              { cancelable: false }
            );
          }, 200);
        });
      }
    }
  };

  showSuccessMessage = () =>
    Alert.alert(
      labels.NEW_CUSTOMER,
      labels.RECORD_SAVE,
      [{ text: labels.OK, onPress: () => this.goBack() }],
      {
        cancelable: false
      }
    );

  onValueChange = (name, value) => {
    // const { name, type, value } = event.nativeEvent;
    const { customer } = this.state;
    this.setState({
      customer: { ...customer, [name]: value }
    });
  };

  replaceKey = (key, newKey) => {
    const value = this.state.customer[key];
    delete this.state.customer[key];
    const customer = Object.assign(this.state.customer, { [newKey]: value });
    this.setState({
      customer
    });
  };

  replaceKeyOnObject = (object, key, newKey) => {
    const value = object[key];
    delete object[key];
    return Object.assign(object, { [newKey]: value });
  };

  checkNetworkConnectivity = async () => {
    const isConnected = await AsyncStorage.getItem('networkConnectivity');
    this.setState({ isConnected: isConnected == 'true' });
  };

  renderGetLocationIcon = () => {
    if (this.state.isConnected) {
      return (
        <TouchableOpacity onPress={this.getGeocodedAddress}>
          <View style={styles.geocodeAddressButton}>
            <Text style={styles.geocodeAddressButtonIcon}></Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const edit = this.state.edit;

    const {
      id,
      pricebookid,
      routeid,
      name,
      comment,
      registrationtype,
      shopsize,
      clusterpriority,
      OrganizationDEO_JTI_PromotionAcceptanceRatio_c,
      primaryaddress: { street, city, country, additional, postalcode, state },
      primarycontact: {
        firstname,
        lastname,
        countrycode,
        phone,
        alternatephone,
        email,
        primary
      },
      extension
    } = this.state.customer;
    /*const { FirstName, LastName, EmailAddress, MobileNumber } =
      this.state.Contact && this.state.Contact.length > 0
        ? this.state.Contact[0]
        : {};*/

    let data = ['Wholesaler', 'Tobacconist'];
    let dataClusterPriority = ['High', 'Medium', 'Low'];
    let dataCountry = ['CA', 'IE'];

    const {
      auth: { profile }
    } = this.props;
    const isDistributionCentreCanada =
      profile && profile.PrimaryCountry_c == 'CA' ? true : false;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}
      >
        {this.state.loading ? <Loader /> : null}
        <ScrollView>
          <KeyboardAvoidingView
            style={[
              styles.container,
              {
                paddingLeft: 20,
                paddingRight: 20
              }
            ]}
            behavior="padding"
            enabled
          >
            <View style={styles.header}>
              <View
                style={{
                  flex: 3,
                  padding: 10
                }}
              >
                <Text style={styles.headerText}>{labels.GENERAL_INFO}</Text>
              </View>

              {this.state.edit ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingTop: 5,
                    paddingBottom: 5
                  }}
                >
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={this.onCustomerSaveClick}
                  >
                    <Text style={styles.headerButtonIcon}>  </Text>
                    <Text style={styles.headerButtonText}> {labels.SAVE}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingTop: 5,
                    paddingBottom: 5
                  }}
                >
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={this.onEditHandler}
                  >
                    <Text style={styles.headerButtonIcon}>  </Text>
                    <Text style={styles.headerButtonText}> {labels.EDIT}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>
                  {labels.CUSTOMER_ACCOUNT_NAME}*
                </Text>
                <TextInput
                  onChangeText={text => this.onValueChange('name', text)}
                  underlineColorAndroid="transparent"
                  value={name}
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                />
              </View>
              <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>{labels.ACCOUNT_TYPE}*</Text>
                {edit ? (
                  <View style={styles.dropdownParentView}>
                    <ModalDropdown
                      defaultIndex={data.indexOf(registrationtype)}
                      defaultValue={data[data.indexOf(registrationtype)]}
                      textStyle={styles.dropdownText}
                      style={styles.dropdownView}
                      dropdownStyle={{ flex: 1, width: '40%' }}
                      dropdownTextStyle={styles.dropdownText}
                      options={data}
                      onSelect={(index, value) => {
                        const { customer } = this.state;
                        this.setState({
                          customer: { ...customer, registrationtype: value }
                        });
                      }}
                    />
                    <Text style={styles.editIconStyle}> </Text>
                  </View>
                ) : (
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.textValue}
                    editable={edit}
                    selectTextOnFocus={edit}
                  >
                    {registrationtype}
                  </TextInput>
                )}
              </View>
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>{labels.SHOP_SIZE}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text => this.onValueChange('shopsize', text)}
                  name="shopsize"
                  value={shopsize}
                />
              </View>
              {isDistributionCentreCanada ? (
                <View style={styles.textColumn2}>
                  <Text style={styles.textLabel}>
                    {labels.CLUSTER_PRIORITY}
                  </Text>

                  {edit ? (
                    <View style={styles.dropdownParentView}>
                      <ModalDropdown
                        defaultIndex={dataClusterPriority.indexOf(
                          clusterpriority
                        )}
                        defaultValue={
                          dataClusterPriority[
                            dataClusterPriority.indexOf(clusterpriority)
                          ]
                        }
                        style={styles.dropdownView}
                        textStyle={styles.dropdownText}
                        dropdownStyle={{ flex: 1, width: '40%' }}
                        dropdownTextStyle={styles.dropdownText}
                        options={dataClusterPriority}
                        onSelect={(index, value) => {
                          const { customer } = this.state;
                          this.setState({
                            customer: {
                              ...customer,
                              clusterpriority: value
                            }
                          });
                        }}
                      />
                      <Text style={styles.editIconStyle}> </Text>
                    </View>
                  ) : (
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={styles.textValue}
                      editable={edit}
                      selectTextOnFocus={edit}
                    >
                      {clusterpriority}
                    </TextInput>
                  )}
                </View>
              ) : (
                <View style={styles.textColumn2}>
                  <Text style={styles.textLabel}>
                    {labels.PROMOTION_ACCEPTANCE_RATIO}
                  </Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.textValue}
                    editable={edit}
                    selectTextOnFocus={edit}
                    onChangeText={text =>
                      this.onValueChange(
                        'OrganizationDEO_JTI_PromotionAcceptanceRatio_c',
                        text
                      )
                    }
                  >
                    {OrganizationDEO_JTI_PromotionAcceptanceRatio_c}
                  </TextInput>
                </View>
              )}
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.6, marginRight: 5 }}>
                    <Text style={styles.textLabel}>{labels.OUTLET_TYPE}</Text>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={styles.textValue}
                      editable={false}
                      selectTextOnFocus={edit}
                    >
                      {labels.NA}
                    </TextInput>
                  </View>
                  <View style={{ flex: 0.4, marginLeft: 5 }}>
                    <Text style={styles.textLabel}>{labels.AREA}</Text>
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={styles.textValue}
                      editable={false}
                      selectTextOnFocus={edit}
                    >
                      {labels.NA}
                    </TextInput>
                  </View>
                </View>
              </View>
              <View style={styles.textColumn2} />
              {/* <View style={styles.textColumn2}>
              <Text style={styles.textLabel}>
                {labels.PROMOTION_ACCEPTANCE_RATIO}
              </Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              >
                {JTI_PromotionAcceptanceRatio_c}
              </TextInput>
            </View> */}
            </View>
            <View style={[styles.header, styles.headerWithSmallButton]}>
              <Text style={[styles.headerText, { flex: 0 }]}>
                {labels.ADDRESS}:
              </Text>
              {/* {this.renderGetLocationIcon()} */}
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>{labels.ADDRESS_LINE1}*</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primaryaddress', {
                      ...this.state.customer.primaryaddress,
                      additional: text
                    })
                  }
                  name="additional"
                  value={additional}
                />
              </View>
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>{labels.ADDRESS_LINE2}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primaryaddress', {
                      ...this.state.customer.primaryaddress,
                      street: text
                    })
                  }
                  name="street"
                  value={street}
                />
              </View>
              {/* <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>{labels.ADDRESS_LINE3}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('AddressLine3', text)
                  }
                  name="AddressLine3"
                  value={AddressLine3}
                />
              </View> */}
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>{labels.ADDRESS_CITY}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primaryaddress', {
                      ...this.state.customer.primaryaddress,
                      city: text
                    })
                  }
                  name="city"
                  value={city}
                />
              </View>
              <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>
                  {isDistributionCentreCanada
                    ? labels.ADDRESS_PROVINCE
                    : labels.ADDRESS_COUNTY}
                </Text>

                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  name={'state'}
                  selectTextOnFocus={edit}
                  value={state}
                  onChangeText={text =>
                    this.onValueChange('primaryaddress', {
                      ...this.state.customer.primaryaddress,
                      state: text
                    })
                  }
                />
              </View>
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>
                  {labels.ADDRESS_POSTAL_CODE}
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primaryaddress', {
                      ...this.state.customer.primaryaddress,
                      postalcode: text
                    })
                  }
                  name="postalcode"
                  value={postalcode}
                />
              </View>
              <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>{labels.ADDRESS_COUNTRY}*</Text>
                {edit ? (
                  <View style={styles.dropdownParentView}>
                    <ModalDropdown
                      defaultIndex={dataCountry.indexOf(country)}
                      defaultValue={dataCountry[dataCountry.indexOf(country)]}
                      style={styles.dropdownView}
                      textStyle={styles.dropdownText}
                      dropdownStyle={{ flex: 1, width: '40%' }}
                      dropdownTextStyle={styles.dropdownText}
                      options={dataCountry}
                      onSelect={(index, value) => {
                        const { customer } = this.state;
                        this.setState({
                          customer: {
                            ...customer,
                            primaryaddress: {
                              ...customer.primaryaddress,
                              country: value
                            }
                          }
                        });
                      }}
                    />
                    <Text style={styles.editIconStyle}> </Text>
                  </View>
                ) : (
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={styles.textValue}
                    editable={edit}
                    selectTextOnFocus={edit}
                  >
                    {country}
                  </TextInput>
                )}
              </View>
            </View>

            {/* <View style={styles.header}>
            <Text style={[styles.headerText, { flex: 1 }]}>
              {labels.SHIPPING_ADDRESS}:
            </Text>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textColumn1}>
              <Text style={styles.textLabel}>{labels.ADDRESS_LINE1}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textColumn1}>
              <Text style={styles.textLabel}>{labels.ADDRESS_LINE2}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
            <View style={styles.textColumn2}>
              <Text style={styles.textLabel}>{labels.ADDRESS_LINE3}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textColumn1}>
              <Text style={styles.textLabel}>{labels.ADDRESS_CITY}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
            <View style={styles.textColumn2}>
              <Text style={styles.textLabel}>{labels.ADDRESS_STATE}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
          </View>
          <View style={styles.textRow}>
            <View style={styles.textColumn1}>
              <Text style={styles.textLabel}>{labels.ADDRESS_POSTAL_CODE}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
            <View style={styles.textColumn2}>
              <Text style={styles.textLabel}>{labels.ADDRESS_COUNTRY}</Text>
              <TextInput
                style={styles.textValue}
                editable={edit}
                selectTextOnFocus={edit}
              />
            </View>
          </View> */}

            <View style={styles.header}>
              <Text style={[styles.headerText, { flex: 1 }]}>
                {labels.CONTACT_DETAILS}
              </Text>
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>
                  {labels.CONTACT_PERSON_NAME}*
                </Text>
                <TextInput
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primarycontact', {
                      ...this.state.customer.primarycontact,
                      firstname: text
                    })
                  }
                  underlineColorAndroid="transparent"
                  name="firstname"
                  value={firstname}
                />
              </View>
              <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>{labels.POSTION_TITLE}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primarycontact', {
                      ...this.state.customer.primarycontact,
                      lastname: text
                    })
                  }
                  name="lastname"
                  value={lastname}
                />
              </View>
            </View>
            <View style={styles.textRow}>
              <View style={styles.textColumn1}>
                <Text style={styles.textLabel}>{labels.EMAIL}*</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primarycontact', {
                      ...this.state.customer.primarycontact,
                      email: text
                    })
                  }
                  name="email"
                  value={email}
                />
              </View>
              <View style={styles.textColumn2}>
                <Text style={styles.textLabel}>{labels.PHONE_NUMBER}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={styles.textValue}
                  editable={edit}
                  selectTextOnFocus={edit}
                  onChangeText={text =>
                    this.onValueChange('primarycontact', {
                      ...this.state.customer.primarycontact,
                      phone: text
                    })
                  }
                  name="phone"
                  value={phone}
                />
              </View>
            </View>

            <View style={styles.header}>
              <Text style={[styles.headerText, { flex: 1 }]}>
                {labels.TERMS}
              </Text>
            </View>
            <View style={styles.textColumn1}>
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.textAreaValue}
                editable={edit}
                selectTextOnFocus={edit}
                multiline={true}
                numberOfLines={4}
                maxLength={40}
                onChangeText={text => this.onValueChange('comment', text)}
                name="comment"
                value={comment}
              />
            </View>

            {/* <View style={styles.header}>
            <Text style={[styles.headerText, { flex: 1 }]}>
              {labels.OPEN_ITEMS}
            </Text>
          </View>

          <View style={styles.textColumn1}>
            <TextInput
              style={styles.textAreaValue}
              editable={edit}
              selectTextOnFocus={edit}
              multiline={true}
              numberOfLines={4}
              maxLength={40}
            >
              {Comments}
            </TextInput>
          </View> */}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default CustomerInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerWithSmallButton: {
    justifyContent: 'flex-start'
  },
  headerText: {
    flex: 1,
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButton: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  headerButtonIcon: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },

  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  textColumn1: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',

    marginRight: 5
  },
  textColumn2: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',

    marginLeft: 5
  },
  textLabel: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 5,
    color: APP_THEME.APP_FONT_COLOR_DARK
  },
  textValue: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontFamily: APP_FONTS.FONT_REGULAR,
    borderWidth: 1,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2
  },
  dropdownParentView: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdownView: {
    flex: 8
  },
  dropdownText: {
    flex: 1,
    fontSize: 18,
    fontFamily: APP_FONTS.FONT_REGULAR,
    color: APP_THEME.APP_LIST_FONT_COLOR
  },
  textAreaValue: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontFamily: APP_FONTS.FONT_REGULAR,
    borderWidth: 1,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2,
    height: 100
  },
  editIconStyle: {
    flex: 1,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 32,
    textAlign: 'center'
  },
  geocodeAddressButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    width: 20,
    height: 20,
    transform: [{ rotate: '45deg' }],
    marginStart: 5
  },
  geocodeAddressButtonIcon: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 13,
    alignItems: 'center',
    paddingLeft: 1
  }
});
